import {Component} from "./component";
import {Entity} from "./entity";
import {EntityConnector} from "./entity-connector";

export class AcadyConfig extends Component {
    entities?: Entity[];
    entityConnectors?: EntityConnector[];
}
