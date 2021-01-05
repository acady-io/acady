import {DebugHelper} from "../../helpers/debug-helper";
import {AcadyConfigHelper} from "../../helpers/acady-config-helper";
import {CliHelper} from "../../helpers/cli-helper";

import entityConnectors from "../../config/entity-connectors";
import {Entity} from "../../dto/entity";
import chalk from "chalk";
import {StringHelper} from "../../helpers/string-helper";
import {EntityCodeGenerator} from "../../code-generators/entity-code-generator";
import logSymbols from "log-symbols";

export class AddEntityAction {

    public static async addEntity(cmdObj) {
        DebugHelper.setCommand(cmdObj);

        let folder = process.cwd();
        await AddEntityAction.addEntityFolder(folder);
    }

    public static async addEntityFolder(folder: string) {
        let acadyConfig = AcadyConfigHelper.getConfig(folder);
        if (!acadyConfig) {
            return;
        }

        if (!acadyConfig.entities)
            acadyConfig.entities = [];

        const newEntity = new Entity();
        do {
            newEntity.name = await CliHelper.prompt({
                message: 'Name of the new entity (e.g. "Pet")',
            });

            if (newEntity.name.includes('-') || StringHelper.upperFirstLetter(newEntity.name) !== newEntity.name) {
                console.log(logSymbols.error, 'Please use camel case with upper first letter and no dashes!');
            } else {
                break;
            }
        } while(true);


        newEntity.connector = await CliHelper.prompt({
            message: 'Which connector to use for ' + chalk.whiteBright(newEntity.name) + '?',
            type: 'list',
            choices: CliHelper.getChoices(entityConnectors, acadyConfig)
        });

        if (newEntity.connector === 'dynamodb') {
            // DynamoDb Config
            newEntity.connectorConfig = await CliHelper.prompts([{
                message: 'Name of the DynamoDb table',
                type: 'input',
                name: 'tableName'
            }, {
                message: 'Partition Key',
                type: 'input',
                name: 'partitionKey'
            }, {
                message: 'Sort Key (leave emty if no sort key shall be used)',
                type: 'input',
                name: 'sortKey'
            }]);

            if (newEntity.connectorConfig.sortKey === '')
                newEntity.connectorConfig.sortKey = undefined;

            newEntity.properties.push({
                name: newEntity.connectorConfig.partitionKey,
                type: 'string'
            });

            if (newEntity.connectorConfig.sortKey)
                newEntity.properties.push({
                    name: newEntity.connectorConfig.sortKey,
                    type: 'string'
                })

            console.log(newEntity);
        }


        EntityCodeGenerator.generateEntityCode(folder, newEntity);



    }
}
