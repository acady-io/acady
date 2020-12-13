import {ComponentService} from "../../services/component-service";

class ListAction {

    public static list() {
        console.log("Listing components");
        const components = ComponentService.listComponents();
        console.log(components);
    }
}

export {ListAction};
