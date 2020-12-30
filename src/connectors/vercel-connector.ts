import logSymbols = require("log-symbols");
import {VercelCredentials} from "../dto/credentials/vercel-credentials";
import {RepositoryDetails} from "../dto/repository-details";

const fetch = require('node-fetch');
import { URLSearchParams } from 'url';

class VercelConnector {
    private static ENDPOINT = 'https://api.vercel.com/';

    public static async listProjects(credentials: VercelCredentials) {
        const response = await VercelConnector.request(credentials.apiToken, 'v4/projects/');
        return response.projects;
    }

    public static async getCurrentUser(credentials: VercelCredentials) {
        const response = await VercelConnector.request(credentials.apiToken, 'www/user');
        return response.user;
    }

    public static async listTeams(credentials: VercelCredentials) {
        const response = await VercelConnector.request(credentials.apiToken, 'v1/teams/');
        return response.teams;
    }

    public static async listDeployments(credentials: VercelCredentials, options?: any) {
        let path = 'v5/now/deployments?';

        if (options)
            path += (new URLSearchParams(options)).toString();

        const response = await VercelConnector.request(credentials.apiToken, path);
        return response.deployments;
    }

    public static async getDeployment(credentials: VercelCredentials, id: string) {
        const response = await VercelConnector.request(credentials.apiToken, 'v12/now/deployments/' + encodeURIComponent(id));
        return response;
    }

    public static async getLogs(credentials: VercelCredentials, id: string, options?: any): Promise<any[]> {
        let path = 'v2/now/deployments/' + encodeURIComponent(id) + '/events?';

        if (options)
            path += (new URLSearchParams(options)).toString();

        const response = await VercelConnector.request(credentials.apiToken, path);
        return response;
    }

    public static async createTeam(credentials: VercelCredentials, name: string, slug: string) {
        const response = await VercelConnector.request(credentials.apiToken, 'v1/teams/', 'POST', {
            name,
            slug
        });
        return response;
    }

    public static async createProject(credentials: VercelCredentials, projectName, repositoryDetails: RepositoryDetails) {
        const response = await VercelConnector.request(credentials.apiToken, 'v6/projects/', 'POST', {
            name: projectName,
            gitRepository: {
                type: repositoryDetails.provider,
                repo: repositoryDetails.fullName
            }
        });
        return response;
    }

    public static async request(apiToken: string, path: string, method?: string, requestBody?: any, contentType?: string): Promise<any> {
        const url = VercelConnector.ENDPOINT + path;

        // console.log("Vercel Request to " + url);

        const headers: any = {
            'Authorization': 'Bearer ' + apiToken
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
            throw new Error('Not able to communicate with Vercel (Response: ' + response.status + ')');
        }

        return await response.json();
    }

}

export {VercelConnector};
