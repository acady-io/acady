import {EntityProperty} from "./entity-property";

export class Entity {
    name: string;
    connector: string;
    connectorConfig: any;
    properties: EntityProperty[] = [];
}
