import {BitbucketCredentials} from "../dto/credentials/bitbucket-credentials";
import logSymbols = require("log-symbols");
import {StringHelper} from "../helpers/string-helper";

const fetch = require('node-fetch');

export class BitbucketConnector {

    public static async listRepositories(credentials: BitbucketCredentials) {
        let repositories = [];

        let response = null;

        let url = 'https://api.bitbucket.org/2.0/repositories?role=contributor&pagelen=100';

        do {
            response = await BitbucketConnector.request(credentials, url);
            repositories = repositories.concat(response.values);

            url = response.next;

        } while (response.next && response.values.length >= 0)

        return repositories;
    }

    public static async listWorkspaces(credentials: BitbucketCredentials) {
        let workspaces = [];

        let response = null;

        let url = 'https://api.bitbucket.org/2.0/workspaces?role=member&pagelen=100';

        do {
            response = await BitbucketConnector.request(credentials, url);
            workspaces = workspaces.concat(response.values);

            url = response.next;

        } while (response.next && response.values.length >= 0)

        return workspaces;
    }

    public static async listProjects(credentials: BitbucketCredentials, workspaceSlug: string) {
        let projects = [];

        let response = null;

        let url = 'https://api.bitbucket.org/2.0/workspaces/' + workspaceSlug + '/projects?pagelen=100';

        do {
            response = await BitbucketConnector.request(credentials, url);
            projects = projects.concat(response.values);

            url = response.next;

        } while (response.next && response.values.length >= 0)

        return projects;
    }

    public static async createProject(credentials: BitbucketCredentials, workspaceSlug: string, projectName: string, projectKey: string) {
        let url = 'https://api.bitbucket.org/2.0/workspaces/' + workspaceSlug + '/projects';

        const response = await BitbucketConnector.request(credentials, url, 'POST', {
            name: projectName,
            key: projectKey,
            is_private: true
        });

        return response;
    }

    public static async createRepository(credentials: BitbucketCredentials, workspaceSlug: string, repoSlug: string, projectKey: string) {
        let url = 'https://api.bitbucket.org/2.0/repositories/' + workspaceSlug + '/' + repoSlug;

        const response = await BitbucketConnector.request(credentials, url, 'POST', {
            scm: 'git',
            project: {
                key: projectKey
            },
            is_private: true
        });

        return response;
    }

    public static async request(credentials: BitbucketCredentials, url: string, method?: string, requestBody?: any, contentType?: string): Promise<any> {

        const headers: any = {
            'Authorization': 'Basic ' + StringHelper.encodeBase64(credentials.username + ":" + credentials.appPassword)
        };

        const requestInit: any = {
            headers
        };

        if (requestBody) {
            if (typeof requestBody !== 'string')
                requestBody = JSON.stringify(requestBody);

            headers['Content-Type'] = contentType || 'application/json';
            requestInit.body = requestBody;
        }

        if (method)
            requestInit.method = method;

        const response = await fetch(url, requestInit);

        if (!response.ok) {
            console.warn(logSymbols.error, await response.text());
            throw new Error('Not able to communicate with Bitbucket (Response: ' + response.status + ')');
        }

        return await response.json();
    }

}

