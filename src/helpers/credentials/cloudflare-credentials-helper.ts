import {CloudflareCredentials} from "../../dto/credentials/cloudflare-credentials";
import {CloudflareConnector} from "../../connectors/cloudflare-connector";
import logSymbols = require("log-symbols");

class CloudflareCredentialsHelper {

    public static async areValid(credentials: CloudflareCredentials): Promise<boolean> {
        try {
            await CloudflareConnector.verifyToken(credentials.apiToken);

            const workers = await CloudflareConnector.listWorkers(credentials);

            if (Array.isArray(workers))
                return true;

        } catch (e) {
            console.log(logSymbols.error, "Error: " + e.message);
        }
        return false;
    }


}

export {CloudflareCredentialsHelper};
