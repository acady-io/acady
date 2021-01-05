import {ComponentService} from "../../services/component-service";
import {Command} from "commander";
import {DebugHelper} from "../../helpers/debug-helper";
import logSymbols = require("log-symbols");
import {ProjectService} from "../../services/project-service";
import {SubtypeHelper} from "../../helpers/subtype-helper";
const Table = require('cli-table');

class ListAction {

    public static async list(cmdObj: Command) {
        DebugHelper.setCommand(cmdObj);
        try {
            console.log("Listing components");
            let components = ComponentService.listComponents();
            let filterProject = null;

            if (cmdObj.project) {
                const project = await ProjectService.loadProject(cmdObj.project);
                if (project) {
                    filterProject = project.id;
                }
            }

            components = components.filter(component => {
                if (filterProject && component.projectId !== filterProject)
                    return false;

                return true;
            });



            const table = new Table({
                head: ['ID', 'Name', 'Project', 'Type'],
                colWidths: [25, 50, 12, 30]
            });

            components.forEach(component => {
                const project = ProjectService.loadProject(component.projectId);
                const type = SubtypeHelper.getSubtypeName(component.subtype);
                const projectKey = project?.key || 'NONE';

                table.push([
                    component.id,
                    component.name,
                    projectKey,
                    type
                ]);
            });


            console.log(table.toString() + "\n");

        } catch (e) {
            if (e)
                console.warn(logSymbols.error, e.message);

            DebugHelper.debug(e);
        }
    }
}

export {ListAction};
