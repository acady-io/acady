import {Component} from "../../dto/component";
import {CliHelper} from "../../helpers/cli-helper";
import subtypes from "../../config/subtypes";

export class SetupTypeAction {

    public static async setupType(component: Component) {

        if (!component.type)
            component.type = await CliHelper.prompt({
                type: 'list',
                name: 'type',
                message: 'What component do you want to build?',
                choices: [{
                    value: 'backend',
                    name: 'Backend component (API, Task Worker, Stream Processor, Backend Library, etc.)'
                }, {
                    value: 'frontend',
                    name: 'Frontend component (Web Site, Web App, React Library, etc.)'
                }]
            });

        if (!component.subtype)
            component.subtype = await CliHelper.prompt({
                type: 'list',
                name: 'type',
                message: 'What ' + component.type + ' component do you want to build?',
                choices: CliHelper.getChoices(subtypes, component)
            });
    }
}
