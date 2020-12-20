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

    public static storeComponent(component: Component) {
        let components = ComponentService.listComponents();
        components = components.filter(filterComponent => filterComponent.id !== component.id);
        components.push(component);
        ComponentService.storeComponents(components);
    }


    public static createComponent(component: Component) {
        if (ComponentService.loadComponent(component.name)) {
            throw new Error('Component ' + component.name + ' already exists!');
        }

        component.id = nanoid();

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

    public static loadComponent(componentId: string): Component {
        const components = ComponentService.listComponents();

        for (let component of components) {
            if (component.id == componentId)
                return component;
        }
        return null;
    }
}

export {ComponentService};
