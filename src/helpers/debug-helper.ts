import {Command} from "commander";
import chalk from "chalk";

export class DebugHelper {
    private static cmdObj;

    public static setCommand(cmdObj: Command) {
        if (DebugHelper.cmdObj)
            throw new Error('Command Object already set!');

        DebugHelper.cmdObj = cmdObj;
    }

    public static debugLog(...args) {
        if (DebugHelper.cmdObj?.debug === true) {
            console.log(...args);
        }
    }

    public static debug(exception) {
        if (DebugHelper.cmdObj?.debug === true) {
            console.log(chalk.grey('DEBUG'), 'Version: ' + DebugHelper.getMostParentCommand().version());
            console.log(chalk.grey('DEBUG'), 'Message:', exception.message);
            console.log(chalk.grey('DEBUG'), 'Stack:', exception.stack);
            console.log(chalk.grey('DEBUG'), 'Exception:', exception);
            console.log(chalk.grey('DEBUG'), 'Serialized Exception:', JSON.stringify(exception));
        }
    }

    private static getMostParentCommand() {
        let cmd = DebugHelper.cmdObj;
        do {
            if (cmd.parent)
                cmd = cmd.parent;
            else
                return cmd;
        } while (true)

    }
}

