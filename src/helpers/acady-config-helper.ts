import logSymbols = require("log-symbols");
import {AcadyConfig} from "../dto/acady-config";
import {FileHelper} from "./file-helper";
const fs = require('fs');

export class AcadyConfigHelper {

    public static getConfig(folder: string): AcadyConfig {
        try {
            let json = fs.readFileSync(FileHelper.path([folder, 'acady.json'])).toString('utf-8');
            json = json.replace(/\,(?!\s*?[\{\[\"\'\w])/g, ''); // Remove trailing commas
            const acadyConfig = JSON.parse(json);
            return acadyConfig;
        } catch (e) {
            console.log(logSymbols.error, 'No acady config found in folder ' + folder);
            console.log(logSymbols.info, 'Switch to the folder containing the acady.json file or use --folder or --id option');
            return;
        }
    }

    public static storeConfig(acadyConfig: AcadyConfig, folder: string) {
        fs.writeFileSync(FileHelper.path([folder, 'acady.json']), JSON.stringify(acadyConfig, null, 2) + "\n");
    }
}
