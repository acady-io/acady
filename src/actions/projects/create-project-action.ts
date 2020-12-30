import {Command} from "commander";
import {DebugHelper} from "../../helpers/debug-helper";
import {ProjectAction} from "../common/project-action";

const logSymbols = require('log-symbols');

class CreateProjectAction {

    public static async createProject(cmdObj: Command) {
        DebugHelper.setCommand(cmdObj);
        try {

            const newProject = await ProjectAction.createProject();

            console.log(logSymbols.success, "Project " + newProject.name + " created!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }


}

export {CreateProjectAction};
