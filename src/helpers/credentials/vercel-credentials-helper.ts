import {VercelCredentials} from "../../dto/credentials/vercel-credentials";
import {VercelConnector} from "../../connectors/vercel-connector";
import logSymbols = require("log-symbols");

export class VercelCredentialsHelper {


    public static async verify(credentials: VercelCredentials): Promise<string> {
        try {
            const projects = await VercelConnector.listProjects(credentials);

            if (!Array.isArray(projects))
                return;

            const user = await VercelConnector.getCurrentUser(credentials);
            return user.username;

        } catch (e) {
            console.log(logSymbols.error, "Error: " + e.message);
        }
        return;
    }
}
