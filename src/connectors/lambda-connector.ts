import {Credentials, Lambda} from "aws-sdk";

class LambdaConnector {


    public static listFunctions(credentials: Credentials, region: string, marker?: string): Promise<Lambda.ListFunctionsResponse> {
        const client = LambdaConnector.getClient(credentials, region);

        const params = {
            Marker: marker
        };

        return new Promise((resolve, reject) => {
            client.listFunctions(params,(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    private static getClient(credentials: Credentials, region: string): Lambda {
        return new Lambda({
            region,
            credentials
        });
    }

}

export {LambdaConnector};
