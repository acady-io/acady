import {Command} from "commander";
import {AcadyConfigHelper} from "../../helpers/acady-config-helper";
import {AcadyConfig} from "../../dto/acady-config";
import {ExecHelper} from "../../helpers/exec-helper";
import logSymbols = require("log-symbols");

export class DevAction {

    public static async dev(cmdObj: Command) {
        let folder = process.cwd();
        await DevAction.devFolder(folder);
    }

    private static async devFolder(folder: string) {
        let acadyConfig = AcadyConfigHelper.getConfig(folder);
        if (!acadyConfig)
            return;

        switch (acadyConfig.subtype) {
            case "gatsby":
                await DevAction.devGatsby(acadyConfig, folder);
                break;
        }

    }

    private static async devGatsby(acadyConfig: AcadyConfig, folder: string) {
        console.log(logSymbols.info, 'acady is starting gatsby in development mode ...');
        await ExecHelper.pipe('gatsby', ['develop'], folder);
    }
}

