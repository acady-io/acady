import {WaitHelper} from "@web-academy/core-lib";
import chalk from "chalk";
import {AcadyConfig} from "../dto/acady-config";
import {VercelConnector} from "../connectors/vercel-connector";
import {AccountService} from "../services/account-service";
import ora = require("ora");
import logSymbols = require("log-symbols");
import moment = require("moment");
import {GitDeployer} from "./git-deployer";
import {VercelCredentials} from "../dto/credentials/vercel-credentials";
import {DebugHelper} from "../helpers/debug-helper";

export class VercelDeployer {

    public static async deployVercel(acadyConfig: AcadyConfig, folder, stage) {
        try {

            const vercelConfig = acadyConfig.accounts.vercel;
            const vercelAccount = AccountService.getAccount('vercel', vercelConfig.accountId);
            const vercelCredentials: VercelCredentials = vercelAccount.credentials;

            if (acadyConfig.hosting.providerData.vercelAccountId.startsWith('team_'))
                vercelCredentials.teamId = acadyConfig.hosting.providerData.vercelAccountId;

            let projectConfig = VercelDeployer.getProjectConfig(acadyConfig);
            if (projectConfig)
                await VercelConnector.updateProject(vercelCredentials, acadyConfig.hosting.providerData.id, projectConfig);

            const timestamp = Date.now();
            const commitId = await GitDeployer.commitAndPush(acadyConfig, folder, stage);

            const spinner1 = ora('Waiting for Vercel to start deployment ').start();
            let deploymentUid = await VercelDeployer.findCommitVercelDeployment(acadyConfig, vercelCredentials, commitId);
            spinner1.stopAndPersist({
                symbol: logSymbols.info,
                text: 'Deployment ' + deploymentUid + ' started'
            });

            let deployment: any = {};

            let from = timestamp;

            const spinner2 = ora('Deployment is running ').start();
            do {
                deployment = await VercelConnector.getDeployment(vercelCredentials, deploymentUid);
                let to = Date.now();

                const logs = await VercelConnector.getLogs(vercelCredentials, deploymentUid, {
                    since: from,
                    until: to
                })
                from = to;

                spinner2.stop();

                for (let log of logs) {
                    if (!log.payload.text)
                        continue;
                    const symbol = log.type === 'stdout' ? logSymbols.info : logSymbols.warning;
                    const time = moment(log.date).format('YYYY-MM-DD HH:mm:ss');
                    console.log(chalk.grey('[Vercel]'), symbol, time, log.payload.text);
                }

                spinner2.start();

                if (deployment.readyState === 'QUEUED' || deployment.readyState === 'BUILDING') {
                    await WaitHelper.wait(1000);
                } else {
                    break;
                }
            } while (true);

            if (deployment.readyState == 'ERROR') {
                spinner2.stopAndPersist({
                    symbol: logSymbols.error,
                    text: 'Deployment ' + deployment.id + ' failed'
                });

            } else if (deployment.readyState == 'READY') {
                spinner2.stopAndPersist({
                    symbol: logSymbols.success,
                    text: 'Deployment ' + deployment.id + ' succeeded'
                });

                console.log(logSymbols.info, 'Your deployment is now available here:');
                // console.log(deployment);

                for (let alias of deployment.alias) {
                    console.log('>', 'https://' + alias + '/');
                }
            }
        } catch (e) {
            console.log(logSymbols.error, e.message);
            DebugHelper.debug(e);
        }

    }


    private static async findCommitVercelDeployment(acadyConfig: AcadyConfig, credentials: VercelCredentials, commitId): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const timeout = setTimeout(() => {
                reject('This commit has not triggered a Deployment.');
            }, 60000);

            const options: any = {
                projectId: acadyConfig.hosting.providerData.id
            };
            options['meta-' + acadyConfig.repository.provider + 'CommitSha'] = commitId;

            do {
                let deployments = await VercelConnector.listDeployments(credentials, options);
                if (deployments.length === 1) {
                    clearTimeout(timeout);
                    resolve(deployments[0].uid);
                    break; // Is this necessary?
                } else
                    await WaitHelper.wait(500);
            } while (true)
        });
    }

    private static getProjectConfig(acadyConfig: AcadyConfig) {
        switch (acadyConfig.subtype) {
            case "nextjs":
                return {
                    framework: "nextjs",
                };
        }

    }
}
