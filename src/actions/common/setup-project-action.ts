import {Component} from "../../dto/component";
import {ProjectService} from "../../services/project-service";
import {CliHelper} from "../../helpers/cli-helper";
import {ProjectAction} from "./project-action";

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
            const newProject = await ProjectAction.createProject();
            component.projectId = newProject.id;
        }
    }
}
