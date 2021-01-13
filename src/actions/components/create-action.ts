import {Component} from "../../dto/component";
import {SetupProjectAction} from "../common/setup-project-action";
import {SetupHostingAction} from "../common/setup-hosting-action";
import {SetupRepositoryAction} from "../common/setup-repository-action";
import {SetupTemplateAction} from "../common/setup-template-action";
import {SetupTypeAction} from "../common/setup-type-action";
import {Command} from "commander";
import {SetupNameAction} from "../common/setup-name-action";
import {HostingHelper} from "../../helpers/hosting-helper";
import {SubtypeHelper} from "../../helpers/subtype-helper";
import {ComponentService} from "../../services/component-service";
import {SetupFolderAction} from "../common/setup-folder-action";
import {DebugHelper} from "../../helpers/debug-helper";
import {InitAction} from "../component/init-action";

const logSymbols = require('log-symbols');

class CreateAction {

    public static async create(cmdObj: Command) {
        DebugHelper.setCommand(cmdObj);
        try {
            console.clear();

            const component = CreateAction.bootstrapCompoment(cmdObj);

            await SetupNameAction.setupName(component);
            await SetupProjectAction.setupProject(component);
            await SetupTypeAction.setupType(component);
            ComponentService.storeComponent(component);

            await SetupRepositoryAction.setupRepository(component);
            ComponentService.storeComponent(component);

            await SetupHostingAction.setupHosting(component);
            ComponentService.storeComponent(component);

            await SetupTemplateAction.setupTemplate(component);
            ComponentService.storeComponent(component);

            await SetupFolderAction.setupFolder(component);
            ComponentService.storeComponent(component);

            await InitAction.initFolder(component.folder);

            component.status = 'READY';
            ComponentService.storeComponent(component);

            console.log(logSymbols.success, "Component " + component.name + " created!");
        } catch (e) {
            if (e)
                console.warn(logSymbols.error, e.message);

            DebugHelper.debug(e);
        }
    }


    private static bootstrapCompoment(cmdObj: Command): Component {
        let component = new Component();

        if (cmdObj.id) {
            component = ComponentService.loadComponent(cmdObj.id);
            if (!component)
                throw new Error('Component with id ' + cmdObj.id + ' not found!');
        }


        if (cmdObj.type) {
            const subtypeName = SubtypeHelper.getSubtypeName(cmdObj.type);
            if (!subtypeName)
                throw new Error('(Sub-)Type not found!');

            console.log(logSymbols.info, "Create component of type " + subtypeName);

            switch (cmdObj.type) {
                case "gatsby":
                    component.type = 'frontend';
                    component.subtype = 'gatsby';
                    break;
            }
        }

        if (cmdObj.hosting) {
            const hostingName = HostingHelper.getHostingName(cmdObj.hosting);
            if (!hostingName)
                throw new Error('Hosting provider not found!');

            console.log(logSymbols.info, "Hosting to use: " + hostingName);
            component.hosting.hostingProvider = cmdObj.hosting;
        }


        return component;
    }
}

export {CreateAction};
