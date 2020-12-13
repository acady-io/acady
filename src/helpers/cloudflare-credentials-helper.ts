import {Credentials} from "aws-sdk";
import {LambdaConnector} from "../connectors/lambda-connector";
import {CloudflareCredentials} from "../dto/cloudflare-credentials";
import logSymbols = require("log-symbols");
import {CloudflareConnector} from "../connectors/cloudflare-connector";

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
