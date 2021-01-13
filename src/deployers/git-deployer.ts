import simpleGit, {SimpleGit} from "simple-git";
import {AcadyConfig} from "../dto/acady-config";
import {CliHelper} from "../helpers/cli-helper";
import ora = require("ora");
import logSymbols = require("log-symbols");
import chalk from "chalk";

export class GitDeployer {
    public static async commitAndPush(acadyConfig: AcadyConfig, folder: string, stage: string) {
        let actions = [];

        const branch = stage === 'prod' ? 'master' : stage;
        const git: SimpleGit = simpleGit({
            baseDir: folder
        });

        const branchInfos = await git.branchLocal();
        const currentBranch = branchInfos.current;
        const existingBranches: string[] = branchInfos.all;
        if (!existingBranches.includes(branch)) {
            await git.branch([branch]);
            console.log(logSymbols.success, 'Created new branch ' + branch);
        }

        if (currentBranch !== branch) {
            console.log(logSymbols.info, `You are currently on branch ${chalk.whiteBright(currentBranch)}, but you want to deploy ${chalk.whiteBright(branch)}`);

            actions = await CliHelper.prompt({
                type: 'list',
                message: 'How shall we solve this issue?',
                choices: [{
                    name: `Switch to ${branch} and try to commit there`,
                    value: ['switch']
                }, {
                    name: `Merge branch ${chalk.whiteBright(currentBranch)} into ${chalk.whiteBright(branch)}, stay on ${currentBranch}`,
                    value: ['merge', 'switchBack']
                }, {
                    name: `Merge branch ${chalk.whiteBright(currentBranch)} into ${chalk.whiteBright(branch)}, switch to ${chalk.whiteBright(branch)}`,
                    value: ['merge']
                }]
            });

            await git.checkout(branch);
            console.log(logSymbols.success, `Branch switched from ${currentBranch} to ${branch}`);
        }

        if (actions.includes('merge')) {
            const mergeResult = await git.merge( [currentBranch, '--no-ff']);
            if (mergeResult.failed) {
                console.log(logSymbols.warning, 'MergeConflicts: ', mergeResult.conflicts);
            } else {
                console.log(logSymbols.success, 'Merge succeeded');
            }
        }

        await git.add('*');
        const gitStatus = await git.status();

        // console.log('gitDiff', gitStatus);

        if (gitStatus.files.length > 0) {
            const commitMessage = await CliHelper.prompt({
                type: 'input',
                message: 'Commit Message:',
            });
            await git.commit(commitMessage);
        } else {
            console.log(logSymbols.info, 'No changes to commit');
        }


        const longId = await git.revparse(branch);
        const spinner = ora('Pushing to ' + acadyConfig.repository.provider).start();
        const pushResult = await git.push('origin', branch);
        const updated = pushResult.update;
        spinner.stopAndPersist({
            symbol: logSymbols.success,
            text: updated
                ? 'Pushed to ' + acadyConfig.repository.provider
                : 'Everything pushed already'
        });

        if (actions.includes('switchBack')) {
            await git.checkout(currentBranch);
            console.log(logSymbols.success, `Branch switched back from ${branch} to ${currentBranch}`);
        }

        return longId;
    }
}
