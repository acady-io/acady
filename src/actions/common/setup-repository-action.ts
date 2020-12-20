import {Component} from "../../dto/component";
import {SetupAccountAction} from "./setup-account-action";
import {CliHelper} from "../../helpers/cli-helper";
import {AccountService} from "../../services/account-service";
import {BitbucketConnector} from "../../connectors/bitbucket-connector";
import repoServices from "../../config/repo-services";
import {GithubConnector} from "../../connectors/github-connector";
import {GitlabConnector} from "../../connectors/gitlab-connector";
import {StringHelper} from "../../helpers/string-helper";

export class SetupRepositoryAction {

    public static async setupRepository(component: Component) {
        if (!component.repository.provider)
            component.repository.provider = await CliHelper.prompt({
                type: 'list',
                name: 'repoService',
                message: 'Please select the git repository provider you want to use:',
                choices: repoServices.map(repoService => {
                    return {
                        name: repoService.name,
                        value: repoService.id
                    }
                })
            });

        await SetupAccountAction.setupAccounts(component);

        if (!component.repository.gitUrl) {
            switch (component.repository.provider) {
                case "bitbucket":
                    await this.setupBitbucketRepository(component);
                    break;
                case "github":
                    await this.setupGithubRepository(component);
                    break;
                case "gitlab":
                    await this.setupGitlabRepository(component);
                    break;
                default:
                    throw new Error('Repo Service not yet implemented!');
            }
        }
    }

    private static async setupBitbucketRepository(component: Component) {
        const bitbucketConfig = component.accounts.bitbucket;
        const bitbucketAccount = AccountService.loadAccount('bitbucket', bitbucketConfig.accountId);
        const workspaces = await BitbucketConnector.listWorkspaces(bitbucketAccount.credentials);

        let workspace = await CliHelper.prompt({
            type: 'list',
            name: 'workspace',
            message: 'Please select the Bitbucket workspace to use:',
            choices: workspaces.map(workspace => {
                return {
                    name: workspace.name,
                    value: workspace.slug
                }
            })
        });

        const projects = await BitbucketConnector.listProjects(bitbucketAccount.credentials, workspace);
        let project = await CliHelper.prompt({
            type: 'list',
            name: 'project',
            message: 'Please select the Bitbucket project to use:',
            choices: [
                ...projects.map(project => {
                    return {
                        name: project.name,
                        value: project.key
                    }
                }),
                {
                    name: 'New Bitbucket project',
                    value: 'NEW'
                }
            ]
        });

        if (project === 'NEW') {
            let projectConfig = await CliHelper.getInquirer().prompt([{
                type: 'input',
                name: 'name',
                message: 'Project Name:',
            }, {
                type: 'input',
                name: 'key',
                message: 'Project Key:',
            }]);

            let newProject = await BitbucketConnector.createProject(bitbucketAccount.credentials, workspace, projectConfig.name, projectConfig.key);
            project = newProject.key;
        }

        let repositoryName = await CliHelper.prompt({
            type: 'input',
            name: 'repositoryName',
            message: 'Name of the repository:',
            default: component.id,
        });

        const newRepo = await BitbucketConnector.createRepository(bitbucketAccount.credentials, workspace, repositoryName, project);

        component.repository.gitUrl = 'https://bitbucket.org/' + newRepo.full_name + '.git';
        component.repository.fullName = newRepo.full_name;
    }

    private static async setupGithubRepository(component: Component) {
        const githubConfig = component.accounts.github;
        const githubAccount = AccountService.loadAccount('github', githubConfig.accountId);
        let org = null;

        const organizations = await GithubConnector.listOrganizations(githubAccount.credentials);

        if (organizations.length > 0) {

            org = await CliHelper.prompt({
                type: 'list',
                name: 'org',
                message: 'Please select the Github organization to use:',
                default: 'NONE',
                choices: [{
                    value: 'NONE',
                    name: 'No Organization (store in my ' + githubAccount.id + ' account)'
                }, ...organizations.map(org => {
                    return {
                        name: org.organization.login,
                        value: org.organization.login
                    }
                })]
            });
            if (org === 'NONE')
                org = undefined;
        }

        let repositoryName = await CliHelper.prompt({
            type: 'input',
            name: 'repositoryName',
            message: 'Name of the repository:',
            default: component.id,
        });

        const newRepo = await GithubConnector.createRepo(githubAccount.credentials, org, repositoryName);

        component.repository.gitUrl = newRepo.clone_url;
        component.repository.fullName = newRepo.full_name;

    }

    private static async setupGitlabRepository(component: Component) {
        const gitlabConfig = component.accounts.gitlab;
        const gitlabAccount = AccountService.loadAccount('gitlab', gitlabConfig.accountId);
        const namespaces = await GitlabConnector.listNamespaces(gitlabAccount.credentials);

        let namespace = await CliHelper.prompt({
            type: 'list',
            name: 'org',
            message: 'Please select namespace for new GitLab repository:',
            default: 'NONE',
            choices: [{
                value: 'NEW',
                name: 'New namespace (group)'
            }, ...namespaces.map(namespace => {
                return {
                    name: namespace.name + ' (' + namespace.path + ')',
                    value: namespace.id
                }
            })]
        });

        if (namespace === 'NEW') {
            let groupName = await CliHelper.prompt({
                type: 'input',
                name: 'name',
                message: 'Name of new GitLab group'
            });

            let groupPath = await CliHelper.prompt({
                type: 'input',
                name: 'path',
                message: 'URL path of new GitLab group (slug)',
                default: StringHelper.slugify(groupName)
            });

            let newGroup = await GitlabConnector.createGroup(gitlabAccount.credentials, groupName, groupPath);
            namespace = newGroup.id;
        }

        let repositoryName = await CliHelper.prompt({
            type: 'input',
            name: 'repositoryName',
            message: 'Name of the repository (GitLab project):',
            default: component.id,
        });

        const newRepo = await GitlabConnector.createProject(gitlabAccount.credentials, repositoryName, StringHelper.slugify(repositoryName), namespace);

        component.repository.gitUrl = newRepo.http_url_to_repo;
        component.repository.fullName = newRepo.path_with_namespace;
    }
}
