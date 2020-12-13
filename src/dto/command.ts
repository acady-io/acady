import {Option} from "./option";

class Command {
    command: string;
    description: string;
    action: Function;
    options?: Option[];
}

export {Command};
