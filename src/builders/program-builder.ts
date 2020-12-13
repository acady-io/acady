import {Command} from "../dto/command";

const { program } = require('commander');
import commands from "../config/commands";

class ProgramBuilder {

    public static build() {

        program.version('1.0.2');
        program.description('CLI tool to build, bootstrap, deploy and manage serverless and web components.');

        for (let command of commands) {
            this.addCommand(program, command);
        }

        return program;
    }

    private static addCommand(program: any, command: Command) {
        const programCommand = program.command(command.command).description(command.description).action(command.action);

        if (command.options) {
            for (let option of command.options) {
                programCommand.option(option.option, option.description);
            }
        }
    }
}

export {ProgramBuilder};
