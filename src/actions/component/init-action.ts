import {Command} from "commander";
import {ComponentService} from "../../services/component-service";
import {NpmHelper} from "../../helpers/npm-helper";
import {AcadyConfigHelper} from "../../helpers/acady-config-helper";

import path from "path";

export class InitAction {

    public static async init(cmdObj: Command) {
        let folder = process.cwd();

        if (cmdObj.folder) {
            folder = path.resolve(cmdObj.folder);
        } else if (cmdObj.id) {
            const component = ComponentService.loadComponent(cmdObj.id);
            folder = component.folder;
        }

        await InitAction.initFolder(folder);
    }

    public static async initFolder(folder: string) {
        let acadyConfig = AcadyConfigHelper.getConfig(folder);
        if (!acadyConfig)
            return;

        await NpmHelper.install(folder);
    }
}

