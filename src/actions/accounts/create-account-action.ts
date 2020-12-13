import {AwsCredentialsHelper} from "../../helpers/aws-credentials-helper";
import {Account} from "../../dto/account";
import {AccountService} from "../../services/account-service";
import {CommonAccountAction} from "./common-account-action";

const logSymbols = require('log-symbols');
const inquirer = require('inquirer');

class CreateAccountAction {

    public static async createAccount() {
        try {
            // inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
            // console.clear();

            let newAccount = new Account();

            const answers = await inquirer.prompt([{
                type: 'list',
                name: 'type',
                message: 'Which account type you want to create:',
                choices: [{
                    value: 'aws',
                    name: 'Amazon WebServices'
                }, {
                    value: 'cloudflare',
                    name: 'Cloudflare'
                }]
            }, {
                type: 'input',
                name: 'name',
                message: 'Please name the account:'
            }]);

            newAccount.type = answers.type;
            newAccount.name = answers.name;

            await CommonAccountAction.updateCredentials(newAccount);

            await AccountService.createAccount(newAccount);
            console.log(logSymbols.info, "Account stored");

            return newAccount;
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {CreateAccountAction};
