import {AwsCredentialsHelper} from "../../helpers/credentials/aws-credentials-helper";
import {Account} from "../../dto/account";
import {AccountService} from "../../services/account-service";
import {CommonAccountAction} from "./common-account-action";

const logSymbols = require('log-symbols');
const inquirer = require('inquirer');

class ConnectAccountAction {

    public static async createAccount() {
        try {
            // inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
            // console.clear();

            let newAccount = new Account();
            await CommonAccountAction.connectAccount(newAccount);

            console.log(logSymbols.info, "Account stored");
            return newAccount;
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {ConnectAccountAction};
