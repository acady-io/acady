import {Command} from "commander";
import {AcadyConfigHelper} from "../../helpers/acady-config-helper";
import {AcadyConfig} from "../../dto/acady-config";
import simpleGit, {SimpleGit} from "simple-git";
import {CliHelper} from "../../helpers/cli-helper";
import ora = require("ora");
import logSymbols = require("log-symbols");
import {VercelConnector} from "../../connectors/vercel-connector";
import {AccountService} from "../../services/account-service";
import {WaitHelper} from "@web-academy/core-lib";
import moment = require("moment");
import * as chalk from "chalk";

export class DeployAction {

    public static async deploy(cmdObj: Command) {
        let folder = process.cwd();
        await DeployAction.deployFolder(folder);
    }

    public static async deployFolder(folder) {
        let acadyConfig = AcadyConfigHelper.getConfig(folder);
        if (!acadyConfig)
            return;

        switch (acadyConfig.hosting.hostingProvider) {
            case "vercel":
                await DeployAction.deployVercel(acadyConfig, folder);
                break;
        }

    }

    private static async deployVercel(acadyConfig: AcadyConfig, folder) {
        const vercelConfig = acadyConfig.accounts.vercel;
        const vercelAccount = AccountService.getAccount('vercel', vercelConfig.accountId);

        const timestamp = Date.now();
        const commitId = await DeployAction.commitAndPush(acadyConfig, folder);

        const spinner1 = ora('Waiting for Vercel to start deployment ').start();
        let deploymentUid = await DeployAction.findCommitVercelDeployment(acadyConfig, vercelAccount.credentials, commitId);
        spinner1.stopAndPersist({
            symbol: logSymbols.info,
            text: 'Deployment ' + deploymentUid + ' started'
        });

        let deployment: any = {};

        let from = timestamp;

        const spinner2 = ora('Deployment is running ').start();
        do {
            deployment = await VercelConnector.getDeployment(vercelAccount.credentials, deploymentUid);
            let to = Date.now();

            const logs = await VercelConnector.getLogs(vercelAccount.credentials, deploymentUid, {
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
    }

    private static async commitAndPush(acadyConfig: AcadyConfig, folder: string) {
        const git: SimpleGit = simpleGit({
            baseDir: folder
        });

        await git.add('*');
        const commitMessage = await CliHelper.prompt({
            type: 'input',
            message: 'Commit Message:',
        });

        const spinner = ora('Committing and Pushing to ' + acadyConfig.repository.provider).start();
        const commitResponse = await git.commit(commitMessage);
        const shortId = commitResponse.commit;
        const longId = await git.revparse(shortId);

        await git.push('origin', 'master');
        spinner.stopAndPersist({
            symbol: logSymbols.success,
            text: 'Committed and Pushed to ' + acadyConfig.repository.provider
        });

        return longId;
    }

    private static async findCommitVercelDeployment(acadyConfig: AcadyConfig, credentials: any, commitId): Promise<any> {
        return new Promise(async (resolve, reject) => {
            setTimeout(() => {
                reject('Cannot find Vercel Deployment');
            }, 60000);

            const options: any = {
                projectId: acadyConfig.hosting.providerData.id
            };
            options['meta-' + acadyConfig.repository.provider + 'CommitSha'] = commitId;

            do {
                let deployments = await VercelConnector.listDeployments(credentials, options);
                if (deployments.length == 1) {
                    resolve(deployments[0].uid);
                    break; // Is this necessary?
                } else
                    await WaitHelper.wait(500);
            } while (true)
        });
    }
}
