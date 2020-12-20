import {GitlabCredentials} from "../../dto/credentials/gitlab-credentials";
import {GitlabConnector} from "../../connectors/gitlab-connector";
import logSymbols = require("log-symbols");

export class GitlabCredentialsHelper {

    public static async verify(credentials: GitlabCredentials): Promise<string> {
        try {
            const projects = await GitlabConnector.listProjects(credentials);

            if (!Array.isArray(projects))
                return;

            const user = await GitlabConnector.getCurrentUser(credentials);
            return user.username;

        } catch (e) {
            console.log(logSymbols.error, "Error: " + e.message);
        }
        return;
    }
}
