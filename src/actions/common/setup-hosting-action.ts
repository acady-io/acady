import {CliHelper} from "../../helpers/cli-helper";
import {Component} from "../../dto/component";
import {SetupAccountAction} from "./setup-account-action";

import hostings from "../../config/hostings";
import {VercelConnector} from "../../connectors/vercel-connector";
import {AccountService} from "../../services/account-service";
import logSymbols = require("log-symbols");
import {StringHelper} from "../../helpers/string-helper";
import chalk from "chalk";

export class SetupHostingAction {

    public static async setupHosting(component: Component) {

        if (!component.hosting.hostingProvider) {
            let choices = CliHelper.getChoices(hostings, component);
            if (component.subtype.endsWith('_library')) {
                choices.push({
                    name: 'No Hosting (only Repository)',
                    value: 'NONE'
                });
            }

            component.hosting.hostingProvider = await CliHelper.prompt({
                type: 'list',
                name: 'hosting',
                message: 'Please select the hosting provider:',
                choices
            });
        }

        await SetupAccountAction.setupAccounts(component);

        if (!component.hosting.providerData && component.hosting.hostingProvider !== 'NONE') {
            switch (component.hosting.hostingProvider) {
                case "vercel":
                    await SetupHostingAction.setupVercel(component);
                    break;
                case "netlify":
                    await SetupHostingAction.setupNetlify(component);
                    break;
                case "npm":
                    await SetupHostingAction.setupNpm(component);
                    break;
                case "aws_lambda":
                    await SetupHostingAction.setupAwsLambda(component);
                    break;
                default:
                    throw new Error('No Setup for ' + component.hosting.hostingProvider + ' implemented yet');
            }
        }

    }

    private static async setupVercel(component: Component) {
        const vercelConfig = component.accounts.vercel;
        const vercelAccount = AccountService.loadAccount('vercel', vercelConfig.accountId);

        const currentUser = await VercelConnector.getCurrentUser(vercelAccount.credentials);
        const teams = await VercelConnector.listTeams(vercelAccount.credentials);

        let teamData = await CliHelper.prompt({
            type: 'list',
            message: 'Which Vercel Team to use:',
            choices: [{
                name: 'No Team, usw own account (' + currentUser.username + ')',
                value: {
                    id: currentUser.uid,
                    name: currentUser.username
                }
            }, {
                name: 'New Team',
                value: {
                    id: 'NEW'
                }
            }, ...teams.map(team => {
                return {
                    name: team.name + ' (' + team.slug + ')',
                    value: {
                        id: team.id,
                        name: team.name
                    }
                }
            })]
        })

        // console.log("Team Data: ", teamData);

        if (teamData.id === 'NEW') {
            const teamName = await CliHelper.prompt({
                type: 'input',
                message: 'Name of new Vercel team:',
            });
            const teamSlug = await CliHelper.prompt({
                type: 'input',
                message: 'Team URL path:',
                default: StringHelper.slugify(teamName)
            });

            const newTeam = await VercelConnector.createTeam(vercelAccount.credentials, teamName, teamSlug);
            teamData = {
                id: newTeam.id,
                name: teamName
            }
        }

        const projectName = await CliHelper.prompt({
            type: 'input',
            name: 'projectName',
            message: 'Vercel project name:',
            default: component.id
        });

        if (teamData.id !== currentUser.uid) {
            vercelAccount.credentials.teamId = teamData.id;
        }

        do {
            try {
                const newProject = await VercelConnector.createProject(vercelAccount.credentials, projectName, component.repository);
                component.hosting.providerData = {
                    id: newProject.id,
                    name: newProject.name,
                    vercelAccountId: newProject.accountId,
                    alias: newProject.alias.map(alias => {
                        return {
                            domain: alias.domain,
                            environment: alias.environment,
                            target: alias.target,
                            deployment: alias.deployment
                        };
                    })
                };
                break;
            } catch (e) {
                console.log(logSymbols.error, "Vercel is not able to access this repository!");
                const [workspace] = component.repository.fullName.split('/');
                let connectUrl = null;
                let serviceName = null;
                if (component.repository.provider === 'github') {
                    connectUrl = 'https://vercel.com/api/now/registration/install-github-app?accountId=' + teamData.id + '&next=https%3A%2F%2Fvercel.com%2F';
                    serviceName = 'Github';
                } else if (component.repository.provider === 'gitlab') {
                    connectUrl = 'https://vercel.com/api/now/registration/gitlab/connect?accountId=' + teamData.id + '&next=https%3A%2F%2Fvercel.com%2F&mode=connect';
                    serviceName = 'GitLab';
                } else if (component.repository.provider === 'bitbucket') {
                    connectUrl = 'https://vercel.com/api/now/registration/bitbuckt/connect?accountId=' + teamData.id + '&next=https%3A%2F%2Fvercel.com%2F&mode=connect';
                    serviceName = 'Bitbucket';
                }

                console.log(logSymbols.info, "Please connect your Vercel account " + teamData.name + " with " + serviceName + " workspace " + workspace);
                console.log(logSymbols.info, connectUrl);
                await CliHelper.prompt({
                    type: 'confirm',
                    message: "Have you connected your Vercel account " + teamData.name + " with " + serviceName + " workspace " + workspace + '?'
                });
            }

        } while (true)
    }

    private static async setupNetlify(component: Component) {
        const netlifyConfig = component.accounts.vercel;
        const netlifyAccount = AccountService.loadAccount('netlify', netlifyConfig.accountId);


    }

    private static async setupNpm(component: Component) {
        const orgName = await CliHelper.prompt({
            message: 'Name of the NPM organization to use (without @), leave empty if no org shall be used:'
        });

        const packageName = await CliHelper.prompt({
            message: 'Name of the NPM package (without org prefix):',
            default: component.id
        });

        const fullPackageName = orgName && orgName.length > 0 ? '@' + orgName + '/' + packageName : packageName;

        console.log(logSymbols.info, 'We use the following full npm package name: ', chalk.whiteBright(fullPackageName));

        component.hosting.providerData = {
            npmPackage: packageName,
            npmOrg: orgName,
            npmFullPackage: fullPackageName
        };

    };


    private static async setupAwsLambda(component: Component) {
        const lambdaName = await CliHelper.prompt({
            message: 'Name of the lambda function:',
            default: component.id
        });

        component.hosting.providerData = {
            lambdaName: lambdaName
        }

        if (component.subtype === 'rest_api') {
            component.hosting.providerData.apiGatewayName = await CliHelper.prompt({
                message: 'Name of the API Gateway:',
                default: component.id
            });
        }

    }
}
