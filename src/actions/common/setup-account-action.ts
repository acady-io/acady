import {AwsRegionHelper} from "../../helpers/aws-region-helper";
import {AccountService} from "../../services/account-service";
import {Account} from "../../dto/account";
import {CommonAccountAction} from "../accounts/common-account-action";
import {Component} from "../../dto/component";
import {CliHelper} from "../../helpers/cli-helper";
import accountTypes from "../../config/account-types";
import {AccountType} from "../../dto/account-type";
import logSymbols = require("log-symbols");

export class SetupAccountAction {

    public static async setupAccounts(component: Component) {

        for (let accountType of accountTypes) {
            await this.setupAccount(component, accountType);
        }

        if (component.accounts.aws && !component.accounts.aws.region) {
            component.accounts.aws.region = await CliHelper.prompt({
                type: 'autocomplete',
                name: 'aws_region',
                message: 'Please select the AWS region:',
                source: (answers, input) => {
                    return AwsRegionHelper.getRegions(input);
                }
            });
        }

    }


    private static async setupAccount(component: Component, accountType: AccountType) {
        const key = accountType.id;

        if (component.hosting?.hostingProvider?.includes(key) || component.repository?.provider?.includes(key)) {
            if (component.accounts[key])
                return;

            const accountId = await this.selectAccount(accountType);
            const accountConfig = {
                accountId
            };
            component.accounts[key] = accountConfig;
        }
    }

    private static async selectAccount(accountType: AccountType) {
        const key = accountType.id;

        const accounts = AccountService.listAccounts(key);
        if (accounts.length === 1) {
            console.log(logSymbols.info, 'We are using your default ' + accountType.name + ' account (' + accounts[0].name + ')');
            return accounts[0].id;
        }

        let accountId = await CliHelper.prompt({
            type: 'list',
            name: 'accountId',
            message: 'Please select the ' + name + ' account:',
            choices: [
                ...accounts.map(account => {
                    return {
                        value: account.id,
                        name: account.name
                    }
                }), {
                    value: 'NEW',
                    name: 'New ' + name + ' Account'
                }]
        });

        if (accountId === 'NEW') {
            const newAccount = new Account();
            newAccount.type = key;
            await CommonAccountAction.connectAccount(newAccount);
            accountId = newAccount.id;
        }

        return accountId;
    }
}
