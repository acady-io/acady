import {AppService} from "../../services/app-service";
const logSymbols = require('log-symbols');

class CreateAppAction {

    public static async createApp(name: string) {
        try {
            console.log("Creating App " + name + " ...");
            AppService.createApp(name);
            console.log(logSymbols.success, "App " + name + " created!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {CreateAppAction};
