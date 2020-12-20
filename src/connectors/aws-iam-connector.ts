import {Credentials, IAM} from "aws-sdk";

export class AwsIamConnector {

    public static async getCurrentUser(credentials): Promise<IAM.User> {
        const client = AwsIamConnector.getClient(credentials);
        return new Promise((resolve, reject) => {
            client.getUser({},(err, data) => {
                if (err) reject(err);
                else resolve(data.User)
            });
        });
    }

    private static getClient(credentials: Credentials): IAM {
        return new IAM({
            credentials
        });
    }
}
