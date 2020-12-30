import {NpmCredentials} from "../dto/credentials/npm-credentials";

const npmFetch = require('npm-registry-fetch');

export class NpmConnector {


    public static async whoAmI(credentials: NpmCredentials) {

        const response = await npmFetch.json('/-/whoami', {
            token: credentials.authToken
        })
        return response.username;
    }
}
