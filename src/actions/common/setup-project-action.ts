import {Component} from "../../dto/component";
import {ProjectService} from "../../services/project-service";
import {CliHelper} from "../../helpers/cli-helper";
import logSymbols = require("log-symbols");

export class SetupProjectAction {

    public static async setupProject(component: Component) {
        if (component.projectId)
            return;

        const projects = ProjectService.listProjects();
        const projectSelection = [];
        projectSelection.push({value: 'NONE', name: 'No project (not recommend)'});
        projectSelection.push({value: 'NEW', name: 'New project'});
        projects.forEach(project => {
            projectSelection.push({value: project.id, name: project.key + ": " + project.name});
        });

        if (!component.projectId)
            component.projectId = await CliHelper.prompt({
                type: 'list',
                message: 'Please select the project the new component will be part of:',
                choices: projectSelection
            });


        if (component.projectId === 'NEW') {
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

            const newProject = ProjectService.createProject(projectName, projectKey);
            component.projectId = newProject.id;
        }
    }
}
