import logSymbols = require("log-symbols");
import {AcadyConfig} from "../dto/acady-config";

const fs = require('fs');

export class AcadyConfigHelper {
    public static getConfig(folder: string): AcadyConfig {
        try {
            const acadyConfig = JSON.parse(fs.readFileSync(folder + '/acady.json'));
            return acadyConfig;
        } catch (e) {
            console.log(logSymbols.error, 'No acady config found in folder ' + folder);
            console.log(logSymbols.info, 'Switch to the folder containing the acady.json file or use --folder or --id option');
            return;
        }
    }
}
