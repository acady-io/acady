import {Component} from "../dto/component";
import {StorageService} from "./storage-service";
import {nanoid} from "nanoid";

class ComponentService {

    public static listComponents(): Component[] {
        return StorageService.loadStorage('components') || [];
    }

    public static storeComponents(components: Component[]) {
        StorageService.storeStorage('components', components);
    }

    public static createComponent(componentName: string, appId: string, runtime: string, type: string) {
        if (ComponentService.loadComponent(componentName)) {
            throw new Error('Component ' + componentName + ' already exists!');
        }

        const component: Component = {
            name: componentName,
            id: nanoid(),
            app_id: appId,
            runtime,
            type
        };

        const componentList = ComponentService.listComponents();
        componentList.push(component);
        ComponentService.storeComponents(componentList);
        return component;
    }

    public static removeComponent(componentName: string) {
        let components = ComponentService.listComponents();
        let filteredComponents = components.filter(component => component.name !== componentName && component.id !== componentName);
        if (components.length == filteredComponents.length)
            throw new Error('Component ' + componentName + ' not found!');

        ComponentService.storeComponents(filteredComponents);
    }

    public static loadComponent(componentName: string): Component {
        const components = ComponentService.listComponents();

        for (let component of components) {
            if (component.name == componentName || component.id == componentName)
                return component;
        }
        return null;
    }
}

export {ComponentService};
