import {AccountService} from "../../services/account-service";
const Table = require('cli-table');

const logSymbols = require('log-symbols');
class ListAccountsAction {

    public static listAccounts(type?: string) {
        const accounts = AccountService.listAccounts(type);

        if (accounts.length == 0) {
            console.log(logSymbols.warning, "There are no accounts yet!");
            return;
        }

        const table = new Table({
            head: ['ID',  'Type', 'Name']
            , colWidths: [25, 25, 50]
        });

        accounts.forEach(account => {
            table.push([
                account.id,
                account.type,
                account.name
            ]);
        });


        console.log(table.toString() + "\n");
    }
}

export {ListAccountsAction};
