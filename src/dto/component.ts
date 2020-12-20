import {HostingDetails} from "./hosting-details";
import {RepositoryDetails} from "./repository-details";

class Component {
    id: string;
    name: string;
    projectId: string;
    hosting = new HostingDetails();
    accounts: any = {};
    type: string;
    subtype: string;
    repository = new RepositoryDetails();
    template: string;
    templateDir: string;
    status = 'SETUP';
    folder: string;
}

export {Component};
