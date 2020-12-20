import {BitbucketCredentials} from "../../dto/credentials/bitbucket-credentials";
import {BitbucketConnector} from "../../connectors/bitbucket-connector";
import logSymbols = require("log-symbols");

export class BitbucketCredentialsHelper {

    public static async areValid(credentials: BitbucketCredentials): Promise<boolean> {
        try {
            const repositories = await BitbucketConnector.listRepositories(credentials);

            if (Array.isArray(repositories))
                return true;

        } catch (e) {
            console.log(logSymbols.error, "Error: " + e.message);
        }
        return false;
    }
}
