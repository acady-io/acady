import {Credentials} from "aws-sdk";
import {AwsLambdaConnector} from "../../connectors/aws-lambda-connector";
import logSymbols = require("log-symbols");
import {AwsIamConnector} from "../../connectors/aws-iam-connector";
import {StringHelper} from "../string-helper";

class AwsCredentialsHelper {

    public static async verify(credentials: Credentials): Promise<string> {
        try {
            const functions = await AwsLambdaConnector.listFunctions(credentials, 'us-east-1');
            if (!Array.isArray(functions.Functions))
                return;

            try {
                const user = await AwsIamConnector.getCurrentUser(credentials);
                const arn = user.Arn;
                const arnParts = arn.split(':');
                return arnParts[5];

            } catch (e) {
                const message = e.message;
                const messageParts = StringHelper.matchAll(message, /arn:aws:iam::(\d+):/gm);
                if (messageParts[1])
                    return messageParts[1];
            }

        } catch (e) {
            console.log(logSymbols.error, "Error: " + e.message);
        }
        return;
    }

}

export {AwsCredentialsHelper};
