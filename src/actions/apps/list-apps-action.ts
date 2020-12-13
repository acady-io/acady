import {AppService} from "../../services/app-service";
const Table = require('cli-table');

const logSymbols = require('log-symbols');
class ListAppsAction {

    public static listApps() {
         const apps = AppService.listApps();

        if (apps.length == 0) {
            console.log(logSymbols.warning, "There are no applications yet!");
            return;
        }

        const table = new Table({
            head: ['ID', 'Name']
            , colWidths: [25, 50]
        });

        apps.forEach(app => {
            table.push([
                app.id,
                app.name
            ]);
        });


        console.log(table.toString() + "\n");
    }
}

export {ListAppsAction};
