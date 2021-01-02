import {Command} from "commander";
import {AcadyConfigHelper} from "../../helpers/acady-config-helper";
import {DebugHelper} from "../../helpers/debug-helper";
import logSymbols = require("log-symbols");
import {TsconfigHelper} from "../../helpers/tsconfig-helper";
import {FileHelper} from "../../helpers/file-helper";
import {ExecHelper} from "../../helpers/exec-helper";

const rimraf = require("rimraf");

export class BuildAction {

    public static async build(cmdObj: Command) {
        DebugHelper.setCommand(cmdObj);

        let folder = process.cwd();
        await BuildAction.buildFolder(folder);
    }

    public static async buildFolder(folder: string) {
        let acadyConfig = AcadyConfigHelper.getConfig(folder);
        if (!acadyConfig) {
            return;
        }

        let tsConfig = TsconfigHelper.getTsConfig(folder);
        if (!tsConfig) {
            return;
        }

        const outDir: string = tsConfig.compilerOptions.outDir;

        if (!outDir || outDir.length === 0) {
            console.log(logSymbols.error, 'Output directory not found in tsconfig.json!');
            console.log(tsConfig);
            return;
        }

        console.log(logSymbols.info, 'Clear output directory (' + outDir + ')');
        rimraf.sync(FileHelper.path([folder, outDir]));

        console.log(logSymbols.info, 'Compile to output directory');
        try {

            await ExecHelper.exec('tsc', [], folder);
        } catch (e) {
            console.warn(e);
        }

    }
}
