import {StorageService} from "./storage-service";
import {Account} from "../dto/account";
import {nanoid} from 'nanoid';
import {account} from "aws-sdk/clients/sns";

class AccountService {
    public static listAccounts(type?: string): Account[] {
        const allAccounts = StorageService.loadStorage('accounts') || [];
        if (!type)
            return allAccounts;
        return allAccounts.filter(account => account.type == type);
    }

    public static storeAccounts(accounts: Account[]) {
        StorageService.storeStorage('accounts', accounts);
    }

    public static storeAccount(account: Account) {
        const oldAccounts = AccountService.listAccounts();
        let newAccounts: Account[] = [];

        for (let oldAccount of oldAccounts) {
            if (oldAccount.type !== account.type || oldAccount.id !== account.id)
                newAccounts.push(oldAccount);
        }

        newAccounts.push(account);
        AccountService.storeAccounts(newAccounts);
    }

    public static createAccount(account: Account) {
        if (!account.type)
            throw new Error('No account type specified!');

        if (!account.name)
            throw new Error('No account name specified!');

        if (AccountService.getAccount(account.type, account.name)) {
            throw new Error('Account ' + account.name + ' already exists!');
        }

        account.id = nanoid();

        const accountList = AccountService.listAccounts();
        accountList.push(account);
        AccountService.storeAccounts(accountList);
        return account;
    }

    public static removeAccount(accountId) {
        let accounts = AccountService.listAccounts();
        let filteredAccounts = accounts.filter(account => account.id !== accountId);
        if (accounts.length == filteredAccounts.length)
            throw new Error('Account ' + accountId + ' not found!');

        AccountService.storeAccounts(filteredAccounts);
    }

    public static loadAccount(accountType: string, accountId: string): Account {
        const accounts = AccountService.listAccounts();

        for (let account of accounts) {
            if (account.id === accountId && account.type == accountType) {
                return account;
            }
        }
        return null;
    }

    public static getAccount(type: string, accountName: string): Account {
        const accounts = AccountService.listAccounts();

        for (let account of accounts) {
            if (account.type == type && (account.name == accountName || account.id == accountName)) {
                return account;
            }
        }
        return null;
    }
}

export {AccountService};
