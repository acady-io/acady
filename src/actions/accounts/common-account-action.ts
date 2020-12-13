import {AwsCredentialsHelper} from "../../helpers/aws-credentials-helper";

import {Account} from "../../dto/account";
import {CloudflareCredentialsHelper} from "../../helpers/cloudflare-credentials-helper";

const logSymbols = require('log-symbols');
const inquirer = require('inquirer');

class CommonAccountAction {

    public static async updateCredentials(account: Account) {
        if (account.type === 'aws') {
            await CommonAccountAction.updateAwsCredentials(account);
        } else if (account.type === 'cloudflare') {
            await CommonAccountAction.updateCloudflareCredentials(account);
        }
    }

    private static async updateAwsCredentials(account: Account) {
        do {
            const credentials = await inquirer.prompt([{
                type: 'input',
                name: 'accessKeyId',
                message: 'AWS Access Key:',
                default: account.credentials?.accessKeyId
            }, {
                type: 'input',
                name: 'secretAccessKey',
                message: 'AWS Secret Key:',
                default: account.credentials?.secretAccessKey
            }]);

            console.log(logSymbols.info, 'Checking credentials ...');

            if (await AwsCredentialsHelper.areValid(credentials)) {
                console.log(logSymbols.success, 'Credentials are valid');
                account.credentials = credentials;
                break;
            } else {
                console.log(logSymbols.error, 'Credentials are NOT valid (or you have not enough rights)');
                console.log(logSymbols.info, 'Try again:');
            }
        } while (true)
    }

    private static async updateCloudflareCredentials(account: Account) {
        do {
            const credentials = await inquirer.prompt([{
                type: 'input',
                name: 'accountId',
                message: 'Cloudflare Account Identifier:',
                default: account.credentials?.accountId
            }, {
                type: 'input',
                name: 'apiToken',
                message: 'API Token:',
                default: account.credentials?.apiToken
            }]);

            console.log(logSymbols.info, 'Checking credentials ...');

            if (await CloudflareCredentialsHelper.areValid(credentials)) {
                console.log(logSymbols.success, 'Credentials are valid');
                account.credentials = credentials;
                break;
            } else {
                console.log(logSymbols.error, 'Credentials are NOT valid (or you have not enough rights)');
                console.log(logSymbols.info, 'Try again:');
            }

        } while (true)
    }
}

export {CommonAccountAction};
