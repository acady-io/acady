import {GithubCredentials} from "../../dto/credentials/github-credentials";
import {GithubConnector} from "../../connectors/github-connector";
import logSymbols = require("log-symbols");

export class GithubCredentialsHelper {

    public static async verify(credentials: GithubCredentials): Promise<string> {
        try {
            const repos = await GithubConnector.listRepos(credentials);

            if (!Array.isArray(repos))
                return;

            const user = await GithubConnector.getCurrentUser(credentials);
            return user.login;

        } catch (e) {
            console.log(logSymbols.error, "Error: " + e.message);
        }
        return;
    }
}
