import {NetlifyCredentials} from "../../dto/credentials/netlify-credentials";
import {NetlifyConnector} from "../../connectors/netlify-connector";
import logSymbols = require("log-symbols");

export class NetlifyCredentialsHelper {

    public static async verify(credentials: NetlifyCredentials): Promise<string> {
        try {
            const sites = await NetlifyConnector.listSites(credentials);

            if (!Array.isArray(sites))
                return;

            const user = await NetlifyConnector.getCurrentUser(credentials);
            return user.slug;

        } catch (e) {
            console.log(logSymbols.error, "Error: " + e.message);
        }
        return;
    }
}
