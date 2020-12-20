import {AccountService} from "../../services/account-service";
import logSymbols = require("log-symbols");
import {CommonAccountAction} from "./common-account-action";

const inquirer = require('inquirer');

class UpdateAccountAction {

    public static async updateAccount(listType?: string) {
        try {

            const accounts = AccountService.listAccounts(listType);

            if (accounts.length == 0)
                throw new Error("No accounts to update");

            const selectAnswers = await inquirer.prompt([{
                type: 'list',
                message: 'Select account to update',
                name: 'accountId',
                choices: accounts.map(account => {
                    return {
                        name: account.name + " (" + account.type + ")",
                        value: account.type + '|' + account.id
                    };
                })
            }]);


            const [type, accountId] = selectAnswers.accountId.split('|');
            const account = AccountService.loadAccount(type, accountId);
            await CommonAccountAction.connectAccount(account);
            console.log(logSymbols.success, "Account " + account.name + " udpated!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {UpdateAccountAction};
