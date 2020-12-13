import {Command} from "../dto/command";
import {CreateAction} from "../actions/components/create-action";
import {ListAction} from "../actions/components/list-action";
import {ListAppsAction} from "../actions/apps/list-apps-action";
import {CreateAppAction} from "../actions/apps/create-app-action";
import {RemoveAppAction} from "../actions/apps/remove-app-action";
import {CreateAccountAction} from "../actions/accounts/create-account-action";
import {ListAccountsAction} from "../actions/accounts/list-accounts-action";
import {RemoveAccountAction} from "../actions/accounts/remove-account-action";
import {UpdateAccountAction} from "../actions/accounts/update-account-action";

const commands: Command[] = [{
    command: 'create <name>',
    description: 'Create a new component',
    action: name => CreateAction.create(name)
}, {
    command: 'create-app <name>',
    description: 'Create a new application',
    action: name => CreateAppAction.createApp(name)
}, {
    command: 'create-account',
    description: 'Create a new account (AWS, Cloudflare, ...)',
    action: name => CreateAccountAction.createAccount()
}, {
    command: 'list',
    description: 'List components',
    action: () => ListAction.list()
}, {
    command: 'list-apps',
    description: 'List applications',
    action: () => ListAppsAction.listApps()
}, {
    command: 'list-accounts [type]',
    description: 'List accounts',
    action: type => ListAccountsAction.listAccounts(type)
},{
    command: 'update-account [type]',
    description: 'Update account',
    action: type => UpdateAccountAction.updateAccount(type)
}, {
    command: 'remove-app <name>',
    description: 'Remove application',
    action: name => RemoveAppAction.removeApp(name)
}, {
    command: 'remove-account [type]',
    description: 'Remove account',
    action: type => RemoveAccountAction.removeAccount(type)
}, {
    command: 'login',
    description: 'Connect acady to your acady.io account',
    action: () => {}
}, {
    command: 'sync',
    description: 'Sync your local acady storage with acady.io',
    action: () => {}
}];

export default commands;

