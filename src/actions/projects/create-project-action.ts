import {ProjectService} from "../../services/project-service";
import {CliHelper} from "../../helpers/cli-helper";
const logSymbols = require('log-symbols');

class CreateProjectAction {

    public static async createProject(projectName: string) {
        try {
            console.log("Creating Project " + projectName + " ...");
            const projectKey = await CliHelper.prompt({
                type: 'input',
                message: 'Project Key (short, uppercase ID)',
                default: projectName.substr(0, 3).toUpperCase(),
                validate: (projectKey) => {
                    const exists = !!ProjectService.loadProject(projectKey);
                    if (exists)
                        console.log(" " + logSymbols.error, "Project with this name already exists!");
                    return !exists;
                }
            });
            ProjectService.createProject(projectName, projectKey);
            console.log(logSymbols.success, "Project " + projectName + " created!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {CreateProjectAction};
