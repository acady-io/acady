/**
 * @version 1.1.0
 */
import {Entity} from "../dto/entity";
import {FileHelper} from "../helpers/file-helper";
import {ClassCodeGenerator} from "./class-code-generator";
import {StringHelper} from "../helpers/string-helper";

const pluralize = require('pluralize')

export class DynamodbEntityCodeGenerator extends ClassCodeGenerator {
    private readonly folder: string;
    private readonly entity: Entity;

    private readonly entityClass: string;
    private readonly objectName: string;
    private readonly serviceClass: string;

    private readonly entityClassPlural: string;
    private readonly objectNamePlural: string;

    private readonly tableName: string;
    private readonly partitionKey: string;
    private readonly sortKey: string;

    constructor(folder: string, entity: Entity) {
        super();
        this.folder = folder;
        this.entity = entity;

        this.entityClass = entity.name;
        this.serviceClass = this.entityClass + 'DdbService';
        this.objectName = StringHelper.lowerFirstLetter(this.entityClass);

        this.entityClassPlural = pluralize(this.entityClass);
        this.objectNamePlural = pluralize(this.objectName);

        this.tableName = this.entity.connectorConfig.tableName;
        this.partitionKey = this.entity.connectorConfig.partitionKey;
        this.sortKey = this.entity.connectorConfig.sortKey;
    }

    public generateEntityCode() {
        const entityFolder = FileHelper.path([this.folder, 'src', 'entities']);

        const headRows = [
            '/**',
            ' * @author DynamodbEntityCodeGenerator v1.1.0',
            ' */'
        ];
        const rows = this.entity.properties.map(property => {
            return `    ${property.name}: ${property.type};`;
        })
        this.generateClass(entityFolder, this.entityClass, rows, headRows);
        this.generateEntityService();
    }

    private generateEntityService() {
        const entityFolder = FileHelper.path([this.folder, 'src', 'services']);

        const headRows = [
            '/**',
            ' * @author DynamodbEntityCodeGenerator v1.1.0',
            ' */',
            `import {${this.entityClass}} from "../entities/${this.getClassFilename(this.entityClass)}";`,
            'import {DynamodbEntityConnector} from "acady-connector-dynamodb";',
            'import {AttributeMap} from "aws-sdk/clients/dynamodb";'
        ];

        const rows = [
            '    private static connector: DynamodbEntityConnector',
            '',
            ...this.buildGetConnector(),
            '',
            ...this.buildGetEntity(),
            '',
            ...this.buildStoreEntity(),
            '',
            ...this.buildStoreEntities(),
            '',
            ...this.buildDeleteEntity(),
            '',
            ...this.buildListEntities(),
            '',
            ...this.buildToEntity()

        ];
        this.generateClass(entityFolder, this.serviceClass, rows, headRows);
    }

    private buildGetConnector() {
        let params = `'${this.tableName}', '${this.partitionKey}'`;
        if (this.sortKey)
            params += `, '${this.sortKey}'`;

        return [
            '    private static getConnector(): DynamodbEntityConnector {',
            '        if(!this.connector) {',
            `            this.connector = new DynamodbEntityConnector(${params});`,
            '        }',
            '        return this.connector;',
            '    }'
        ];
    }

    private buildGetEntity() {
        let params = this.partitionKey + ': string';
        if (this.sortKey)
            params += ', ' + this.sortKey + ': string';

        const signature = `public static async get${this.entityClass}(${params})`;
        const returnValue = `Promise<${this.entityClass}|undefined>`;

        let keys = this.partitionKey;
        if (this.sortKey)
            keys += ', ' + this.sortKey;

        return [
            `    ${signature}: ${returnValue} {`,
            `        const item = await this.getConnector().getItem({${keys}});`,
            '        if (!item)',
            '            return;',
            `        return ${this.serviceClass}.to${this.entityClass}(item);`,
            '    }'
        ];
    }

    private buildStoreEntity() {
        const signature = `public static async store${this.entityClass}(${this.objectName}: ${this.entityClass})`;
        return [
            `    ${signature}: Promise<void> {`,
            `        await this.getConnector().storeItem(${this.objectName});`,
            '    }'
        ];
    }

    private buildStoreEntities() {
        const signature = `public static async store${this.entityClassPlural}(${this.objectNamePlural}: ${this.entityClass}[])`;
        return [
            `    ${signature}: Promise<void> {`,
            `        await this.getConnector().storeItems(${this.objectNamePlural});`,
            '    }'
        ];
    }

    private buildDeleteEntity() {
        let params = this.partitionKey + ': string';
        if (this.sortKey)
            params += ', ' + this.sortKey + ': string';

        let keys = this.partitionKey;
        if (this.sortKey)
            keys += ', ' + this.sortKey;

        const signature = `public static async delete${this.entityClass}(${params})`;
        return [
            `    ${signature}: Promise<void> {`,
            `        await this.getConnector().deleteItem({${keys}});`,
            '    }'
        ];
    }

    private buildListEntities() {
        const signature = `public static async list${this.entityClassPlural}(queryFilter?: any)`;
        return [
            `    ${signature}: Promise<${this.entityClass}[]> {`,
            '        const items = await this.getConnector().scan(undefined, queryFilter);',
            `        return items.map(item => this.to${this.entityClass}(item));`,
            '    }'
        ];
    }

    private buildToEntity() {
        const signature = `private static to${this.entityClass}(item: AttributeMap)`;
        return [
            `    ${signature}: ${this.entityClass} {`,
            `        return Object.assign(new ${this.entityClass}(), item);`,
            '    }'
        ];
    }

}
