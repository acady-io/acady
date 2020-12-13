import logSymbols = require("log-symbols");
import {CloudflareCredentials} from "../dto/cloudflare-credentials";

const fetch = require('node-fetch');

class CloudflareConnector {

    private static ENDPOINT = 'https://api.cloudflare.com/client/v4/';

    public static async verifyToken(apiToken: string): Promise<boolean> {
        const response = await CloudflareConnector.request(apiToken, 'user/tokens/verify');

        if (!response.success)
            throw new Error('Token Verification failed');

        if (response.result?.status !== 'active')
            throw new Error('Token Verification failed');

        return true;
    }

    public static async listWorkers(credentials: CloudflareCredentials) {
        const response = await CloudflareConnector.request(credentials.apiToken, 'accounts/'+credentials.accountId+'/workers/scripts');

        if (!response.success)
            throw new Error('ListWorkers failed');

        return response.result;
    }


    public static async request(apiToken: string, path: string, method?: string, requestBody?: any, contentType?: string): Promise<any> {
        const url = CloudflareConnector.ENDPOINT + path;

        // console.log("Request to " + url);

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
            throw new Error('Not able to communicate with Cloudflare (Response: ' + response.status + ')');
        }

        return await response.json();
    }

}

export {CloudflareConnector};
