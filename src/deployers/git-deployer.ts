import simpleGit, {SimpleGit} from "simple-git";
import {AcadyConfig} from "../dto/acady-config";
import {CliHelper} from "../helpers/cli-helper";
import ora = require("ora");
import logSymbols = require("log-symbols");

export class GitDeployer {
    public static async commitAndPush(acadyConfig: AcadyConfig, folder: string) {
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
}
