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
            projectSelection.push({value: project.id, name: project.name});
        });

        const answers = await CliHelper.getInquirer().prompt([{
            type: 'list',
            name: 'projectId',
            message: 'Please select the project the new component will be part of:',
            choices: projectSelection
        }, {
            type: 'input',
            name: 'newProjectName',
            message: 'Name of the new project',
            when: (answers) => {
                return answers.projectId == 'NEW';
            },
            validate: (newProjectName) => {
                const exists = !!ProjectService.loadProject(newProjectName);
                if (exists)
                    console.log(" " + logSymbols.error, "Project with this name already exists!");
                return !exists;
            }
        }]);
        if (answers.projectId === 'NEW') {
            const newProject = ProjectService.createProject(answers.newProjectName);
            component.projectId = newProject.id;
        } else {
            component.projectId = answers.projectId;
        }
    }
}
