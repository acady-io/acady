import {GitlabCredentials} from "../dto/credentials/gitlab-credentials";
import logSymbols = require("log-symbols");

const fetch = require('node-fetch');

export class GitlabConnector {

    public static async listProjects(credentials: GitlabCredentials): Promise<any[]> {
        const response: any[] = await GitlabConnector.request(credentials, 'v4/projects/?membership=true');
        return response;
    }

    public static async listGroups(credentials: GitlabCredentials): Promise<any[]> {
        const response: any[] = await GitlabConnector.request(credentials, 'v4/groups/');
        return response;
    }

    public static async listNamespaces(credentials: GitlabCredentials): Promise<any[]> {
        const response: any[] = await GitlabConnector.request(credentials, 'v4/namespaces');
        return response;
    }

    public static async createGroup(credentials: GitlabCredentials, name: string, path: string): Promise<any> {
        const response: any[] = await GitlabConnector.request(credentials, 'v4/groups/', 'POST', {
           name,
           path
        });
        return response;
    }

    public static async createProject(credentials: GitlabCredentials, name: string, path, namespaceId: number): Promise<any> {
        const response: any[] = await GitlabConnector.request(credentials, 'v4/projects', 'POST', {
            name,
            path,
            namespace_id: namespaceId
        });
        return response;

    }

    public static async getCurrentUser(credentials: GitlabCredentials) {
        const response: any = await GitlabConnector.request(credentials, 'v4/user');
        return response;
    }

    public static async request(credentials: GitlabCredentials, path: string, method?: string, requestBody?: any, contentType?: string): Promise<any> {
        const url = 'https://' + credentials.server + '/api/' + path;

        const headers: any = {
            'Authorization': 'Bearer ' + credentials.apiToken
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
            throw new Error('Not able to communicate with Gitlab (Response: ' + response.status + ')');
        }

        return await response.json();
    }

}

