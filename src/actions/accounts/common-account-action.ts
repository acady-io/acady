import {AwsCredentialsHelper} from "../../helpers/credentials/aws-credentials-helper";

import {Account} from "../../dto/account";
import {CloudflareCredentialsHelper} from "../../helpers/credentials/cloudflare-credentials-helper";
import {NetlifyCredentialsHelper} from "../../helpers/credentials/netlify-credentials-helper";
import {GithubCredentialsHelper} from "../../helpers/credentials/github-credentials-helper";
import {VercelCredentialsHelper} from "../../helpers/credentials/vercel-credentials-helper";
import {AccountService} from "../../services/account-service";
import {GitlabCredentialsHelper} from "../../helpers/credentials/gitlab-credentials-helper";
import {CloudflareConnector} from "../../connectors/cloudflare-connector";
import {BitbucketCredentials} from "../../dto/credentials/bitbucket-credentials";
import {BitbucketCredentialsHelper} from "../../helpers/credentials/bitbucket-credentials-helper";
import accountTypes from "../../config/account-types";
import {CliHelper} from "../../helpers/cli-helper";
import {FileHelper} from "../../helpers/file-helper";
import {StringHelper} from "../../helpers/string-helper";
import {NpmCredentialsHelper} from "../../helpers/credentials/npm-credentials-helper";

const logSymbols = require('log-symbols');
const inquirer = require('inquirer');

class CommonAccountAction {

    public static async connectAccount(account: Account) {

        if (!account.type) {
            account.type = await CliHelper.prompt({
                type: 'list',
                name: 'type',
                message: 'Which account type you want to create:',
                choices: accountTypes.map(accountType => {
                    return {
                        value: accountType.id,
                        name: accountType.name
                    };
                })
            });
        }

        await CommonAccountAction.updateCredentials(account);

        account.name = await CliHelper.prompt({
            type: 'input',
            name: 'name',
            message: 'Please name the account:',
            default: account.name || account.id
        });

        if (account.id)
            await AccountService.storeAccount(account);
        else
            await AccountService.createAccount(account);
    }


    public static async updateCredentials(account: Account) {
        switch (account.type) {
            case "aws":
                return await CommonAccountAction.updateAwsCredentials(account);
            case "cloudflare":
                return await CommonAccountAction.updateCloudflareCredentials(account);
            case "netlify":
                return await CommonAccountAction.updateNetlifyCredentials(account);
            case "github":
                return await CommonAccountAction.updateGithubCredentials(account);
            case "vercel":
                return await CommonAccountAction.updateVercelCredentials(account);
            case "gitlab":
                return await CommonAccountAction.updateGitlabCredentials(account);
            case "bitbucket":
                return await CommonAccountAction.updateBitbucketCredentials(account);
            case "npm":
                return await CommonAccountAction.updateNpmCredentials(account);
            default:
                throw new Error("Account Type " + account.type + " not known yet");
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

            const accountId = await AwsCredentialsHelper.verify(credentials);
            if (this.verifyAccountId(account, credentials, accountId))
                break;

        } while (true)
    }

    private static async updateCloudflareCredentials(account: Account) {
        do {
            console.log(logSymbols.info, 'You can receive your API Token here: https://dash.cloudflare.com/profile/api-tokens');
            const apiToken = await CliHelper.prompt({
                type: 'input',
                name: 'apiToken',
                message: 'API Token:',
                default: account.credentials?.apiToken
            });

            const accounts = await CloudflareConnector.listAccounts(apiToken);

            if (accounts.length == 0) {
                console.log(logSymbols.error, 'Credentials are valid but not account associated');
                console.log(logSymbols.info, 'Try again:');
                continue;
            }
            let accountId = null;

            if (accounts.length == 1) {
                accountId = accounts[0].id;
                console.log(logSymbols.info, 'Select account ' + accountId);
            } else {
                accountId = await CliHelper.prompt({
                    type: 'list',
                    name: 'accountId',
                    message: 'Select Cloudflare Account:',
                    default: account.credentials?.accountId,
                    choices: accounts.map(account => {
                        return {
                            value: account.id,
                            name: account.name + " (" + account.id + ")"
                        };
                    })
                });
            }

            const credentials = {
                accountId,
                apiToken
            };

            console.log(logSymbols.info, 'Checking credentials ...');

            if (await CloudflareCredentialsHelper.areValid(credentials)) {
                if (account.id && account.id !== accountId) {
                    console.log(logSymbols.error, 'Already existing account has other ID than verified!?');
                } else {
                    console.log(logSymbols.success, 'Credentials are valid');
                    account.credentials = credentials;
                    account.id = accountId;
                    break;
                }
            } else {
                console.log(logSymbols.error, 'Credentials are NOT valid (or you have not enough rights)');
                console.log(logSymbols.info, 'Try again:');
            }

        } while (true)
    }

    private static async updateNetlifyCredentials(account: Account) {
        do {
            console.log(logSymbols.info, 'You can receive your Personal Access Token here: https://app.netlify.com/user/applications');
            const apiToken = await CliHelper.prompt({
                type: 'input',
                name: 'apiToken',
                message: 'Netlify Personal Access Token:',
                default: account.credentials?.apiToken
            });
            const credentials = {
                apiToken
            };

            console.log(logSymbols.info, 'Checking credentials ...');

            const accountId = await NetlifyCredentialsHelper.verify(credentials);
            if (this.verifyAccountId(account, credentials, accountId))
                break;

        } while (true)
    }

    private static async updateGithubCredentials(account: Account) {
        do {
            console.log(logSymbols.info, 'You can receive your Personal Access Token here: https://github.com/settings/tokens');
            const apiToken = await CliHelper.prompt({
                type: 'input',
                name: 'apiToken',
                message: 'Github Personal Access Token:',
                default: account.credentials?.apiToken
            });
            const credentials = {
                apiToken
            };

            console.log(logSymbols.info, 'Checking credentials ...');

            const accountId = await GithubCredentialsHelper.verify(credentials);
            if (this.verifyAccountId(account, credentials, accountId))
                break;

        } while (true)
    }

    private static async updateVercelCredentials(account: Account) {
        do {

            console.log(logSymbols.info, 'You can receive your Personal Access Token here: https://vercel.com/account/tokens');
            const apiToken = await CliHelper.prompt({
                type: 'input',
                name: 'apiToken',
                message: 'Vercel API Token:',
                default: account.credentials?.apiToken
            });
            const credentials = {
                apiToken
            };

            console.log(logSymbols.info, 'Checking credentials ...');

            const accountId = await VercelCredentialsHelper.verify(credentials);
            if (this.verifyAccountId(account, credentials, accountId))
                break;

        } while (true)
    }

    private static async updateGitlabCredentials(account: Account) {
        do {
            const server = await CliHelper.prompt({
                type: 'input',
                name: 'server',
                message: 'GitLab server:',
                default: account.credentials?.server || 'gitlab.com'
            });
            console.log(logSymbols.info, 'You can receive your Personal Access Token here: https://' + server + '/-/profile/personal_access_tokens');
            const apiToken = await CliHelper.prompt({
                type: 'input',
                name: 'apiToken',
                message: 'GitLab API Token:',
                default: account.credentials?.apiToken
            });

            const credentials = {
                server,
                apiToken
            };

            console.log(logSymbols.info, 'Checking credentials ...');

            const accountId = await GitlabCredentialsHelper.verify(credentials);
            if (this.verifyAccountId(account, credentials, accountId))
                break;

        } while (true)
    }

    private static async updateBitbucketCredentials(account: Account) {
        do {
            const username = await CliHelper.prompt({
                type: 'input',
                name: 'username',
                message: 'Bitbucket username:',
                default: account.credentials?.appPassword
            });
            console.log(logSymbols.info, 'You can generate an App Password here: https://bitbucket.org/account/settings/app-passwords/');
            const appPassword = await CliHelper.prompt({
                type: 'input',
                name: 'appPassword',
                message: 'Bitbucket app password:',
                default: account.credentials?.appPassword
            });

            const credentials: BitbucketCredentials = {
                username,
                appPassword
            };

            console.log(logSymbols.info, 'Checking credentials ...');

            const accountId = username;

            if (await BitbucketCredentialsHelper.areValid(credentials)) {
                if (account.id && account.id !== accountId) {
                    console.log(logSymbols.error, 'Already existing account has other ID than verified!?');
                } else {
                    console.log(logSymbols.success, 'Credentials are valid');
                    account.credentials = credentials;
                    account.id = accountId;
                    break;
                }
            } else {
                console.log(logSymbols.error, 'Credentials are NOT valid (or you have not enough rights)');
                console.log(logSymbols.info, 'Try again:');
            }

        } while (true)
    }


    private static async updateNpmCredentials(account: Account) {

        let authToken = account?.credentials?.authToken;

        if (!authToken) {
            const npmrc = FileHelper.readUserFile('.npmrc');
            if (npmrc) {
                const matches = StringHelper.matchAll(npmrc, /_authToken=([a-z0-9-]+)/gm);
                authToken = matches[1];
                if (authToken) {
                    console.log(logSymbols.info, 'We found an Access Token in your .npmrc file (' + authToken + '). Press enter to use it.');
                }
            }
        }


        do {
            console.log(logSymbols.info, 'You can create a new Personal Access Token here: https://docs.npmjs.com/creating-and-viewing-access-tokens#creating-access-tokens');

            authToken = await CliHelper.prompt({
                type: 'input',
                message: 'NPM Access Token:',
                default: authToken
            });
            const credentials = {
                authToken
            };

            console.log(logSymbols.info, 'Checking credentials ...');

            const accountId = await NpmCredentialsHelper.verify(credentials);
            if (this.verifyAccountId(account, credentials, accountId))
                break;

        } while (true)

    }

    private static verifyAccountId(account: Account, credentials: any, accountId: string) {
        if (accountId) {
            if (account.id && account.id !== accountId) {
                console.log(logSymbols.error, 'Already existing account has other ID than verified!?');
            } else {
                console.log(logSymbols.success, 'Credentials are valid');
                account.credentials = credentials;
                account.id = accountId
                return true;
            }
        } else {
            console.log(logSymbols.error, 'Credentials are NOT valid (or you have not enough rights)');
            console.log(logSymbols.info, 'Try again:');
        }
        return false;
    }


}

export {CommonAccountAction};
