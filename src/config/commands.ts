import {Command} from "../dto/command";
import {CreateAction} from "../actions/components/create-action";
import {ListAction} from "../actions/components/list-action";
import {ListProjectsAction} from "../actions/projects/list-projects-action";
import {CreateProjectAction} from "../actions/projects/create-project-action";
import {RemoveProjectAction} from "../actions/projects/remove-project-action";
import {ConnectAccountAction} from "../actions/accounts/connect-account-action";
import {ListAccountsAction} from "../actions/accounts/list-accounts-action";
import {DisconnectAccountAction} from "../actions/accounts/disconnect-account-action";
import {UpdateAccountAction} from "../actions/accounts/update-account-action";
import {InitAction} from "../actions/component/init-action";
import {DevAction} from "../actions/component/dev-action";
import {DeployAction} from "../actions/component/deploy-action";

const commands: Command[] = [{
    command: 'create',
    description: 'Create a new component',
    options: [{
        option: '-t, --type <type>',
        description: 'Type of new component'
    }, {
        option: '-h, --hosting <hosting>',
        description: 'Hosting to use'
    },{
        option: '-i, --id <id>',
        description: 'Bootstrap an existing component'
    }],
    action: (cmdObj) => CreateAction.create(cmdObj)
}, {
    command: 'init',
    description: 'Init a component',
    options: [{
        option: '-f, --folder <folder>',
        description: 'Folder of the component'
    }, {
        option: '-i, --id <id>',
        description: 'Id of the component'
    }],
    action: (cmdObj) => InitAction.init(cmdObj)
}, {
    command: 'dev',
    description: 'Start develop mode for component',
    action: (cmdObj) => DevAction.dev(cmdObj)
}, {
    command: 'deploy',
    description: 'Deploy a compoment',
    options: [{
        option: '-t, --target <target>',
        description: 'Target of deployment'
    }],
    action: (cmdObj) => DeployAction.deploy(cmdObj)
}, {
    command: 'create-project <name>',
    description: 'Create a new project',
    action: name => CreateProjectAction.createProject(name)
}, {
    command: 'connect-account',
    description: 'Connect a account (AWS, Cloudflare, Github, Netlify, ...)',
    action: name => ConnectAccountAction.createAccount()
}, {
    command: 'list',
    description: 'List components',
    action: () => ListAction.list()
}, {
    command: 'list-projects',
    description: 'List projectlications',
    action: () => ListProjectsAction.listProjects()
}, {
    command: 'list-accounts [type]',
    description: 'List accounts',
    action: type => ListAccountsAction.listAccounts(type)
},{
    command: 'update-account [type]',
    description: 'Update account',
    action: type => UpdateAccountAction.updateAccount(type)
}, {
    command: 'remove-project <name>',
    description: 'Remove projectlication',
    action: name => RemoveProjectAction.removeProject(name)
}, {
    command: 'disconnect-account [type]',
    description: 'Discount a account',
    action: type => DisconnectAccountAction.removeAccount(type)
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

