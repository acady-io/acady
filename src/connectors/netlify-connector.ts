import {NetlifyCredentials} from "../dto/credentials/netlify-credentials";

const NetlifyAPI = require('netlify')

export class NetlifyConnector {

    static async listSites(credentials: NetlifyCredentials) {
        const client = new NetlifyAPI(credentials.apiToken);
        return await client.listSites();
    }

    static async getCurrentUser(crdentials: NetlifyCredentials) {
        const client = new NetlifyAPI(crdentials.apiToken);
        return await client.getCurrentUser();
    }


}
