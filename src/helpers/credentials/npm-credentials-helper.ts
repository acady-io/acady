import {NpmCredentials} from "../../dto/credentials/npm-credentials";
import {NpmConnector} from "../../connectors/npm-connector";
import logSymbols = require("log-symbols");

export class NpmCredentialsHelper {

    public static async verify(credentials: NpmCredentials): Promise<string> {
        try {
            const username = await NpmConnector.whoAmI(credentials);
            if (!username)
                throw new Error('Could not communicate with NPM');

            return username;

        } catch (e) {
            console.log(logSymbols.error, "Error: " + e.message);
        }
        return;
    }
}
