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
            head: ['Type', 'ID',  'Name']
            , colWidths: [16, 32, 60]
        });

        accounts.forEach(account => {
            table.push([
                account.type,
                account.id,
                account.name
            ]);
        });


        console.log(table.toString() + "\n");
    }
}

export {ListAccountsAction};
