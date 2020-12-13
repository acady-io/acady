import {AccountService} from "../../services/account-service";
import logSymbols = require("log-symbols");

const inquirer = require('inquirer');

class RemoveAccountAction {

    public static async removeAccount(type?: string) {
        try {

            const accounts = AccountService.listAccounts(type);

            if (accounts.length == 0)
                throw new Error("No accounts to remove");

            const answers = await inquirer.prompt([{
                type: 'list',
                message: 'Select account to remove',
                name: 'accountId',
                choices: accounts.map(account => {
                    return {
                        name: account.name + " (" + account.type + ")",
                        value: account.id
                    };
                })
            }]);

            const account = AccountService.loadAccount(answers.accountId);
            AccountService.removeAccount(account.id);
            console.log(logSymbols.success, "Account " + account.name + " removed!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {RemoveAccountAction};
