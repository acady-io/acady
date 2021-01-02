import {Command} from "commander";
import {AcadyConfigHelper} from "../../helpers/acady-config-helper";
import {AcadyConfig} from "../../dto/acady-config";
import {ExecHelper} from "../../helpers/exec-helper";
import logSymbols = require("log-symbols");
import {FileHelper} from "../../helpers/file-helper";
import {RestApiDevServer} from "../../servers/rest-api-dev-server";
import {ApiBuilder} from "acady-api-builder";
import {BuildAction} from "./build-action";

export class DevAction {

    public static async dev(cmdObj: Command) {
        let folder = process.cwd();
        await DevAction.devFolder(folder);
    }

    private static async devFolder(folder: string) {
        await BuildAction.buildFolder(folder);

        let acadyConfig = AcadyConfigHelper.getConfig(folder);
        if (!acadyConfig)
            return;

        switch (acadyConfig.subtype) {
            case "gatsby":
                await DevAction.devGatsby(acadyConfig, folder);
                break;
            case "rest_api":
                await DevAction.devRestApi(acadyConfig, folder);
        }
    }

    private static async devGatsby(acadyConfig: AcadyConfig, folder: string) {
        console.log(logSymbols.info, 'acady is starting gatsby in development mode ...');
        await ExecHelper.pipe('gatsby', ['develop'], folder);
    }

    private static async devRestApi(acadyConfig: AcadyConfig, folder: string) {
        console.log(logSymbols.info, 'acady is starting development server for REST api ...');
        const apiPath = FileHelper.path([folder, 'build', 'api.js']);
        const apiBuilder: ApiBuilder = require(apiPath).default;
        const devServer = new RestApiDevServer(apiBuilder);
        await devServer.start();

    }
}

