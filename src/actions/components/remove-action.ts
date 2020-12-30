import {Command} from "commander";
import {CliHelper} from "../../helpers/cli-helper";
import {ComponentService} from "../../services/component-service";

const logSymbols = require('log-symbols');
const rimraf = require("rimraf");

class RemoveAction {

    public static async remove(cmdObj: Command) {
        try {
            const components = await ComponentService.listComponents();

            const componentId = await CliHelper.prompt({
                type: 'list',
                message: 'Which component shall be removed?',
                choices: components.map(component => {
                    return {
                        name: component.id + ': ' + component.name,
                        value: component.id
                    };
                })
            })

            const component = await ComponentService.loadComponent(componentId);

            const removeFolder = await CliHelper.prompt({
                type: 'confirm',
                message: 'Also delete folder ' + component.folder + '? (y/N)',
                default: false
            });

            await ComponentService.removeComponent(componentId);

            if (removeFolder) {
                rimraf.sync(component.folder);
            }

            console.log(logSymbols.success, "Component " + component.name + " removed!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {RemoveAction};
