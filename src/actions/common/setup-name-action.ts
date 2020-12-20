import {Component} from "../../dto/component";
import {CliHelper} from "../../helpers/cli-helper";
import {StringHelper} from "../../helpers/string-helper";
import {ComponentService} from "../../services/component-service";
import logSymbols = require("log-symbols");

export class SetupNameAction {

    public static async setupName(component: Component) {

        if (!component.name)
            component.name = await CliHelper.prompt({
                type: 'input',
                name: 'name',
                message: 'What is the name of your new component?',
            });

        if (!component.id) {
            do {
                const componentId = await CliHelper.prompt({
                    type: 'input',
                    name: 'id',
                    message: 'The ID (and folder name) of the new compoment',
                    default: StringHelper.slugify(component.name)
                });

                if (ComponentService.loadComponent(componentId)) {
                    console.log(logSymbols.error, 'Component with id ' + componentId + ' already exists!');
                    console.log(logSymbols.info, 'Please choose another id or use the --id option for bootstraping the existing component!');
                } else {
                    component.id = componentId;
                    break;
                }
            } while (true)
        }

    }
}
