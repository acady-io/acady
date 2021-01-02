import {Credentials, Lambda} from "aws-sdk";

class AwsLambdaConnector {


    public static listFunctions(credentials: Credentials, region: string, marker?: string): Promise<Lambda.ListFunctionsResponse> {
        const client = AwsLambdaConnector.getClient(credentials, region);

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


    public static createFunction(credentials: Credentials, region: string, params: Lambda.Types.CreateFunctionRequest): Promise<Lambda.FunctionConfiguration> {
        const client = AwsLambdaConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.createFunction(params,(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    public static addPermission(credentials: Credentials, region: string, params: Lambda.Types.AddPermissionRequest): Promise<Lambda.AddPermissionResponse> {
        const client = AwsLambdaConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.addPermission(params,(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    public static createAlias(credentials: Credentials, region: string, functionName: string, functionVersion: string, aliasName: string): Promise<Lambda.AliasConfiguration> {
        const client = AwsLambdaConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.createAlias({
                FunctionName: functionName,
                FunctionVersion: functionVersion,
                Name: aliasName
            },(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    public static updateAlias(credentials: Credentials, region: string, functionName: string, functionVersion: string, aliasName: string): Promise<Lambda.AliasConfiguration> {
        const client = AwsLambdaConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.updateAlias({
                FunctionName: functionName,
                FunctionVersion: functionVersion,
                Name: aliasName
            },(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    public static updateFunctionCode(credentials: Credentials, region: string, params: Lambda.Types.UpdateFunctionCodeRequest): Promise<Lambda.FunctionConfiguration>  {
        const client = AwsLambdaConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.updateFunctionCode(params,(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    public static updateFunctionConfig(credentials: Credentials, region: string, params: Lambda.Types.UpdateFunctionConfigurationRequest): Promise<Lambda.FunctionConfiguration>  {
        const client = AwsLambdaConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.updateFunctionConfiguration(params,(err, data) => {
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

export {AwsLambdaConnector};
