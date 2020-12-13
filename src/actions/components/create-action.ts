import {AppService} from "../../services/app-service";
import {AwsRegionHelper} from "../../helpers/aws-region-helper";
import {AccountService} from "../../services/account-service";

const logSymbols = require('log-symbols');
const inquirer = require('inquirer');

class CreateAction {
    private static appId: string;

    public static async create(name: string) {

        try {
            console.clear();
            console.log("Creating component " + name + " ...");

            inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

            await this.setupApp();
            await this.setupRuntime();

            console.log(logSymbols.success, "Component " + name + " created!");
        } catch (e) {
            if (e)
                console.warn(logSymbols.error, e.message);
        }
    }

    private static async setupApp() {
        const answers = await inquirer.prompt(this.selectAppId());
        if (answers.appId === 'NEW') {
            const newApp = AppService.createApp(answers.newAppName);
            this.appId = newApp.id;
        } else {
            this.appId = answers.appId;
        }
    }

    private static async setupRuntime() {
        const answers = await inquirer.prompt(this.selectRuntime());
        console.log(answers);
    }

    private static selectAppId() {
        const questions: any[] = [];

        const apps = AppService.listApps();
        const appSelection = [];
        appSelection.push({value: 'NONE', name: 'No application (not recommend)'});
        appSelection.push({value: 'NEW', name: 'New application'});
        apps.forEach(app => {
            appSelection.push({value: app.id, name: app.name});
        });
        questions.push({
            type: 'list',
            name: 'appId',
            message: 'Please select the application the new compoment will be part of:',
            choices: appSelection
        });

        questions.push({
            type: 'input',
            name: 'newAppName',
            message: 'Name of the new application',
            when: (answers) => {
                return answers.appId == 'NEW';
            },
            validate: (newAppName) => {
                const exists = !!AppService.loadApp(newAppName);
                if (exists)
                    console.log(" " + logSymbols.error, "App with this name already exists!");
                return !exists;
            }
        });
        return questions;
    }

    private static selectRuntime() {
        const awsAccounts = AccountService.listAccounts("aws");
        const cloudflareAccounts = AccountService.listAccounts("cloudflare");

        const questions: any[] = [];
        questions.push({
            type: 'list',
            name: 'runtime',
            message: 'Please select the runtime environment:',
            choices: [{
                key: 'l',
                value: 'aws_lambda',
                name: 'Lambda (AWS)'
            }, {
                key: 'c',
                value: 'cfw',
                name: 'Workers (Cloudflare)'
            }, {
                key: 'b',
                value: 'browser',
                name: 'Browser (Web App)'
            }, {
                key: 'n',
                value: 'none',
                name: 'None (Library)'
            }]
        });

        questions.push({
            type: 'list',
            name: 'web_hosting',
            message: 'Please select the hosting for your Web App:',
            choices: [{
                value: 's3_cloudfront',
                name: 'S3 + Cloudfront'
            }, {
                value: 's3_cloudflare',
                name: 'S3 + Cloudflare'
            }, {
                value: 'worker_sites',
                name: 'Cloudflare Worker Sites'
            }, {
                value: 'netlify',
                name: 'Netlify'
            }],
            when: (answers) => {
                return answers.runtime == 'browser';
            }
        });

        questions.push({
            type: 'list',
            name: 'aws_account',
            message: 'Please select the AWS account:',
            choices: [{
                value: 'NEW',
                name: 'Add new AWS Account'
            }, ...awsAccounts.map(account => {
                return {
                    value: account.id,
                    name: account.name
                }
            })],
            when: (answers) => {
                if (answers.runtime === 'aws_lambda')
                    return true;

                if (answers.web_hosting.startsWith("s3"))
                    return true;

                return false;
            }
        });


        questions.push({
            type: 'autocomplete',
            name: 'aws_region',
            message: 'Please select the AWS region:',
            source: (answers, input) => {
                return AwsRegionHelper.getRegions(input);
            },
            when: (answers) => {
                return !!answers.aws_account;
            }
        });
        questions.push({
            type: 'list',
            name: 'awsAccount',
            message: 'Please select the Cloudflare account:',
            choices: [{
                value: 'NEW',
                name: 'Add new Cloudflare Account'
            }, ...cloudflareAccounts.map(account => {
                return {
                    value: account.id,
                    name: account.name
                }
            })],
            when: (answers) => {
                if (answers.runtime === 'cfw')
                    return true;

                if (answers.web_hosting === 's3_cloudflare' || answers.web_hosting === 'worker_sites')
                    return true;

                return false;
            }
        });


        return questions;
    }


}

export {CreateAction};
