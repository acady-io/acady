import {ProjectService} from "../../services/project-service";
const Table = require('cli-table');

const logSymbols = require('log-symbols');
class ListProjectsAction {

    public static listProjects() {
         const projects = ProjectService.listProjects();

        if (projects.length == 0) {
            console.log(logSymbols.warning, "There are no projects yet!");
            return;
        }

        const table = new Table({
            head: ['ID', 'Key', 'Name']
            , colWidths: [25, 12, 50]
        });

        projects.forEach(project => {
            table.push([
                project.id,
                project.key,
                project.name
            ]);
        });


        console.log(table.toString() + "\n");
    }
}

export {ListProjectsAction};
