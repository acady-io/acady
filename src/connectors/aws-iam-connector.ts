import {Credentials, IAM} from "aws-sdk";

export class AwsIamConnector {

    public static async getCurrentUser(credentials: Credentials): Promise<IAM.User> {
        const client = AwsIamConnector.getClient(credentials);
        return new Promise((resolve, reject) => {
            client.getUser({},(err, data) => {
                if (err) reject(err);
                else resolve(data.User)
            });
        });
    }

    public static async createRole(credentials: Credentials, roleName: string, assumeRolePolicy: any): Promise<IAM.Role>  {
        const client = AwsIamConnector.getClient(credentials);
        return new Promise((resolve, reject) => {
            client.createRole({
                RoleName: roleName,
                AssumeRolePolicyDocument: JSON.stringify(assumeRolePolicy)
            },(err, data) => {
                if (err) reject(err);
                else resolve(data.Role)
            });
        });
    }

    public static async createPolicy(credentials: Credentials, policyName: string, policy: any): Promise<IAM.Policy>  {
        const client = AwsIamConnector.getClient(credentials);
        return new Promise((resolve, reject) => {
            client.createPolicy({
                PolicyName: policyName,
                PolicyDocument: JSON.stringify(policy)
            },(err, data) => {
                if (err) reject(err);
                else resolve(data.Policy)
            });
        });
    }

    public static async attachRolePolicy(credentials: Credentials, roleName: string, policyArn: string): Promise<IAM.Policy>  {
        const client = AwsIamConnector.getClient(credentials);
        return new Promise((resolve, reject) => {
            client.attachRolePolicy({
                RoleName: roleName,
                PolicyArn: policyArn
            },(err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }

    private static getClient(credentials: Credentials): IAM {
        return new IAM({
            credentials
        });
    }
}
