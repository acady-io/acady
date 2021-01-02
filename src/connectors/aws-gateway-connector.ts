import {Credentials, ApiGatewayV2, Lambda} from "aws-sdk";

export class AwsGatewayConnector {

    public static createApi(credentials: Credentials, region: string, params: ApiGatewayV2.CreateApiRequest): Promise<ApiGatewayV2.CreateApiResponse> {
        const client = AwsGatewayConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.createApi(params,(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    public static createRoute(credentials: Credentials, region: string, params: ApiGatewayV2.CreateRouteRequest): Promise<ApiGatewayV2.CreateRouteResult> {
        const client = AwsGatewayConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.createRoute(params,(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    public static createIntegration(credentials: Credentials, region: string, params: ApiGatewayV2.CreateIntegrationRequest): Promise<ApiGatewayV2.CreateIntegrationResult> {
        const client = AwsGatewayConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.createIntegration(params,(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    public static createStage(credentials: Credentials, region: string, params: ApiGatewayV2.CreateStageRequest): Promise<ApiGatewayV2.CreateStageResponse> {
        const client = AwsGatewayConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.createStage(params,(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    public static updateApi(credentials: Credentials, region: string, params: ApiGatewayV2.UpdateApiRequest): Promise<ApiGatewayV2.UpdateApiResponse> {
        const client = AwsGatewayConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.updateApi(params,(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    public static updateRoute(credentials: Credentials, region: string, params: ApiGatewayV2.UpdateRouteRequest): Promise<ApiGatewayV2.UpdateRouteResult> {
        const client = AwsGatewayConnector.getClient(credentials, region);
        return new Promise((resolve, reject) => {
            client.updateRoute(params,(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    private static getClient(credentials: Credentials, region: string): ApiGatewayV2 {
        return new ApiGatewayV2({
            region,
            credentials
        });
    }
}
