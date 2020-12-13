import {AccountService} from "../../services/account-service";
import logSymbols = require("log-symbols");
import {CommonAccountAction} from "./common-account-action";

const inquirer = require('inquirer');

class UpdateAccountAction {

    public static async updateAccount(type?: string) {
        try {

            const accounts = AccountService.listAccounts(type);

            if (accounts.length == 0)
                throw new Error("No accounts to update");

            const selectAnswers = await inquirer.prompt([{
                type: 'list',
                message: 'Select account to update',
                name: 'accountId',
                choices: accounts.map(account => {
                    return {
                        name: account.name + " (" + account.type + ")",
                        value: account.id
                    };
                })
            }]);

            const account = AccountService.loadAccount(selectAnswers.accountId);

            const nameAnswers = await inquirer.prompt([{
                type: 'input',
                message: 'New account name:',
                name: 'name',
                default: account.name
            }]);

            account.name = nameAnswers.name;
            await CommonAccountAction.updateCredentials(account);
            AccountService.storeAccount(account);
            console.log(logSymbols.success, "Account " + account.name + " udpated!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {UpdateAccountAction};
