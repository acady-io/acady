import {AcadyConfig} from "../dto/acady-config";
import {BuildAction} from "../actions/component/build-action";
import {FileHelper} from "../helpers/file-helper";
import {PackageConfigHelper} from "../helpers/package-config-helper";
import {NpmHelper} from "../helpers/npm-helper";
import {AccountService} from "../services/account-service";
import {AwsLambdaConnector} from "../connectors/aws-lambda-connector";
import {AwsIamConnector} from "../connectors/aws-iam-connector";
import * as chalk from "chalk";
import {AcadyConfigHelper} from "../helpers/acady-config-helper";
import {TsconfigHelper} from "../helpers/tsconfig-helper";
import {AwsGatewayConnector} from "../connectors/aws-gateway-connector";

const tmp = require('tmp');
import logSymbols = require("log-symbols");

const fs = require('fs');
const fse = require('fs-extra');
const gulp = require('gulp');
const zip = require('gulp-zip');

export class LambdaDeployer {

    public static async deployLambda(acadyConfig: AcadyConfig, folder: string, stage: string) {
        try {

            await BuildAction.buildFolder(folder);

            const tsConfig = TsconfigHelper.getTsConfig(folder);
            const outDir = tsConfig.compilerOptions.outDir;

            const deployConfig = acadyConfig.hosting.providerData;
            if (!deployConfig.stages) {
                deployConfig.stages = {};
            }

            if (!deployConfig.stages[stage]) {
                deployConfig.stages[stage] = {};
            }

            const stageConfig = deployConfig.stages[stage];
            const accountConfig = acadyConfig.accounts.aws;
            const awsAccount = await AccountService.loadAccount('aws', accountConfig.accountId);


            const packageJson = PackageConfigHelper.getPackageJson(folder);
            if (!packageJson)
                return;

            const tmpDir = tmp.dirSync().name;
            const zipFile = acadyConfig.id + '.zip';
            const zipFilePath = FileHelper.path([tmpDir, zipFile])
            const workDir = FileHelper.path([tmpDir, acadyConfig.id]);
            fs.mkdirSync(workDir);

            // console.log("WorkDir: " + workDir);

            let fileList: string[] = packageJson.files;
            fileList.push('package.json');

            for (let file of fileList) {
                fse.copySync(FileHelper.path([folder, file]), FileHelper.path([workDir, file]));
            }

            await NpmHelper.install(workDir, ['-q', '--no-audit', '--production']);
            FileHelper.replaceSymlinks(FileHelper.path([workDir, 'node_modules']));
            await LambdaDeployer.zipDir(zipFile, workDir, tmpDir);


            if (!deployConfig.roleArn) {
                deployConfig.roleArn = await LambdaDeployer.createRole(awsAccount.credentials, acadyConfig);
            }

            if (deployConfig.lambdaId) {
                // Update Lambda

                const functionConfiguration = await AwsLambdaConnector.updateFunctionCode(awsAccount.credentials, accountConfig.region, {
                    FunctionName: deployConfig.lambdaName,
                    ZipFile: fs.readFileSync(zipFilePath),
                    Publish: true
                });

                console.log(logSymbols.info, 'New Code deployed to function ' + functionConfiguration.FunctionName);
                stageConfig.lambdaLatestVersion = functionConfiguration.Version;

            } else {
                // Create Lambda
                const functionConfiguration = await AwsLambdaConnector.createFunction(awsAccount.credentials, accountConfig.region, {
                    FunctionName: deployConfig.lambdaName,
                    Role: deployConfig.roleArn,
                    Code: {
                        ZipFile: fs.readFileSync(zipFilePath)
                    },
                    Publish: true,
                    Runtime: "nodejs12.x",
                    Handler: outDir + "/index.handler",
                    Timeout: 60
                });
                console.log(logSymbols.info, 'New Function created: ' + functionConfiguration.FunctionName);

                deployConfig.lambdaId = functionConfiguration.FunctionArn
                stageConfig.lambdaLatestVersion = functionConfiguration.Version;

            }

            if (!stageConfig.lambdaAlias) {
                await AwsLambdaConnector.createAlias(awsAccount.credentials, accountConfig.region, deployConfig.lambdaName, stageConfig.lambdaLatestVersion, stage);
                stageConfig.lambdaAlias = stage;
                console.log(logSymbols.info, 'Create Stage Alias: ' + stageConfig.lambdaAlias);

            } else {
                await AwsLambdaConnector.updateAlias(awsAccount.credentials, accountConfig.region, deployConfig.lambdaName, stageConfig.lambdaLatestVersion, stageConfig.lambdaAlias);
                console.log(logSymbols.info, 'Update Stage Alias: ' + stageConfig.lambdaAlias);
            }

            if (deployConfig.apiGatewayName) {

                if (!deployConfig.apiGatewayId) {
                    const createApiResponse = await AwsGatewayConnector.createApi(awsAccount.credentials, accountConfig.region, {
                        Name: deployConfig.apiGatewayName,
                        ProtocolType: 'HTTP',
                        CorsConfiguration: {
                            AllowMethods: [
                                '*'
                            ],
                            MaxAge: 300,
                            AllowOrigins: [
                                '*'
                            ]
                        }
                    });

                    console.log(logSymbols.info, 'New API Gateway created: ' + createApiResponse.Name + ' (' + createApiResponse.ApiId + ')');
                    // console.log(logSymbols.info, 'with endpoint: ' + createApiResponse.ApiEndpoint);
                    deployConfig.apiGatewayId = createApiResponse.ApiId;
                    deployConfig.apiGatewayEndpoint = createApiResponse.ApiEndpoint;
                }


                if (!deployConfig.gatewayIntegrationId) {
                    const createIntegrationResult = await AwsGatewayConnector.createIntegration(awsAccount.credentials, accountConfig.region, {
                        ApiId: deployConfig.apiGatewayId,
                        IntegrationType: 'AWS_PROXY',
                        IntegrationMethod: 'POST',
                        IntegrationUri: deployConfig.lambdaId + ':${stageVariables.lambdaAlias}',
                        TimeoutInMillis: 30000,
                        PayloadFormatVersion: "2.0"
                    });

                    console.log(logSymbols.info, 'New Lambda Integration created');
                    deployConfig.gatewayIntegrationId = createIntegrationResult.IntegrationId;
                }

                if (!deployConfig.gatewayRouteId) {
                    const createRouteResult = await AwsGatewayConnector.createRoute(awsAccount.credentials, accountConfig.region, {
                        ApiId: deployConfig.apiGatewayId,
                        RouteKey: 'ANY /{proxy+}',
                        Target: 'integrations/' + deployConfig.gatewayIntegrationId
                    });

                    console.log(logSymbols.info, 'New API Gateway Route created');
                    deployConfig.gatewayRouteId = createRouteResult.RouteId;
                }

                if (!stageConfig.gatewayStage) {
                    const createStageResult = await AwsGatewayConnector.createStage(awsAccount.credentials, accountConfig.region, {
                        ApiId: deployConfig.apiGatewayId,
                        StageName: stage,
                        StageVariables: {
                            lambdaAlias: stage
                        },
                        AutoDeploy: true
                    });


                    stageConfig.gatewayStage = createStageResult.StageName;
                    stageConfig.gatewayStageEndpoint = deployConfig.apiGatewayEndpoint + '/' + stage;
                    console.log(logSymbols.info, 'New Stage ' + stage + ' created');

                    await AwsLambdaConnector.addPermission(awsAccount.credentials, accountConfig.region, {
                        FunctionName: deployConfig.lambdaName + ':' + stageConfig.lambdaAlias,
                        StatementId: 'apigateway',
                        Action: 'lambda:InvokeFunction',
                        Principal: 'apigateway.amazonaws.com',
                        SourceArn: `arn:aws:execute-api:${accountConfig.region}:${awsAccount.id}:${deployConfig.apiGatewayId}/*/*`
                    });
                    console.log(logSymbols.info, 'Added Invoke Permission for ApiGateway to stage: ' + stageConfig.lambdaAlias);
                }

                console.log(logSymbols.success, 'Successfully deployed to endpoint: ' + stageConfig.gatewayStageEndpoint + '/');
            }



        } catch (e) {
            console.log(e);
        }

        AcadyConfigHelper.storeConfig(acadyConfig, folder);
    }

    public static async zipDir(zipFile: string, workDir: string, destDir: string) {
        return new Promise(resolve => {
            gulp.src(FileHelper.path([workDir, '**']))
                .pipe(zip(zipFile))
                .pipe(gulp.dest(destDir))
                .on("end", resolve);
        })
    }


    private static async createRole(credentials, acadyConfig: AcadyConfig) {
        const policyDoc = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "*",
                    "Resource": "*"
                }
            ]
        };
        const policy = await AwsIamConnector.createPolicy(credentials, acadyConfig.id + '-policy', policyDoc);
        console.log(logSymbols.info, 'Created Policy ' + chalk.whiteBright(acadyConfig.id + '-policy'));

        const assumeRolePolicy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "lambda.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }
        const role = await AwsIamConnector.createRole(credentials, acadyConfig.id + '-role', assumeRolePolicy);
        console.log(logSymbols.info, 'Created Role ' + chalk.whiteBright(acadyConfig.id + '-role'));

        await AwsIamConnector.attachRolePolicy(credentials, role.RoleName, policy.Arn);
        console.log(logSymbols.info, 'Attaches Policy to Role');

        return role.Arn;
    }

}
