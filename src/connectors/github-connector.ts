import {GithubCredentials} from "../dto/credentials/github-credentials";
import {Octokit} from "@octokit/rest";

class GithubConnector {

    static async listRepos(credentials: GithubCredentials) {
        const response: any = await GithubConnector.getClient(credentials).repos.listForAuthenticatedUser();
        return response.data;
    }

    static getClient(credentials: GithubCredentials): Octokit {
        return new Octokit({
            auth: credentials.apiToken,
        });
    }

    static async getCurrentUser(credentials: GithubCredentials) {
        const response: any = await GithubConnector.getClient(credentials).users.getAuthenticated();
        return response.data;
    }

    static async listOrganizations(credentials: GithubCredentials) {
        let orgs: any[] = [];



        for (let page = 1; page < 100; page++) {
            const response: any = await GithubConnector.getClient(credentials).orgs.listMembershipsForAuthenticatedUser({
                state: 'active',
                per_page: 100,
                page
            });

            if (response.data && response.data.length > 0) {
                orgs = orgs.concat(response.data);
            } else {
                break;
            }
        }
        return orgs;
    }

    static async createRepo(credentials: GithubCredentials, org: string, name: string) {
        let newRepo = null;

        if (org) {
            const response: any = await GithubConnector.getClient(credentials).repos.createInOrg({
                org,
                name,
                private: true
            });
            newRepo = response.data;
        } else {
            const response: any = await GithubConnector.getClient(credentials).repos.createForAuthenticatedUser({
                name,
                private: true
            });
            newRepo = response.data;
        }

        return newRepo;
    }
}

export {GithubConnector};
