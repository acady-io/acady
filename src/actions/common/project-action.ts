import {Project} from "../../dto/project";
import {CliHelper} from "../../helpers/cli-helper";
import {ProjectService} from "../../services/project-service";
import logSymbols = require("log-symbols");

export class ProjectAction {
    public static async createProject(): Promise<Project> {
        const projectName: string = await CliHelper.prompt({
            type: 'input',
            name: 'newProjectName',
            message: 'Name of the new project',
            validate: (projectName) => {
                const exists = !!ProjectService.loadProject(projectName);
                if (exists)
                    console.log(" " + logSymbols.error, "Project with this name already exists!");
                return !exists;
            }
        })
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

        return ProjectService.createProject(projectName, projectKey);
    }
}
