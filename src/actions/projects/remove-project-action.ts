import {ProjectService} from "../../services/project-service";
const logSymbols = require('log-symbols');

class RemoveProjectAction {

    public static async removeProject(name: string) {
        try {
            console.log("Removing Project " + name + " ...");
            ProjectService.removeProject(name)
            console.log(logSymbols.success, "Project " + name + " removed!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {RemoveProjectAction};
