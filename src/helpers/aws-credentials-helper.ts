import {Credentials} from "aws-sdk";
import {LambdaConnector} from "../connectors/lambda-connector";
import logSymbols = require("log-symbols");

class AwsCredentialsHelper {

    public static async areValid(credentials: Credentials): Promise<boolean> {
        try {
            const functions = await LambdaConnector.listFunctions(credentials, 'us-east-1');
            if (Array.isArray(functions.Functions))
                return true;
        } catch (e) {
            console.log(logSymbols.error, "Error: " + e.message);
        }
        return false;
    }

}

export {AwsCredentialsHelper};
