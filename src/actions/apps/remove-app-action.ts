import {AppService} from "../../services/app-service";
const logSymbols = require('log-symbols');

class RemoveAppAction {

    public static async removeApp(name: string) {
        try {
            console.log("Removing App " + name + " ...");
            AppService.removeApp(name)
            console.log(logSymbols.success, "App " + name + " removed!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {RemoveAppAction};
