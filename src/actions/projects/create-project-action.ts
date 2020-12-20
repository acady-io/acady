import {ProjectService} from "../../services/project-service";
const logSymbols = require('log-symbols');

class CreateProjectAction {

    public static async createProject(name: string) {
        try {
            console.log("Creating Project " + name + " ...");
            ProjectService.createProject(name);
            console.log(logSymbols.success, "Project " + name + " created!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {CreateProjectAction};
