import {Command} from "../dto/command";

const { program } = require('commander');
import commands from "../config/commands";
const pjson = require('../../package.json');


class ProgramBuilder {

    public static build() {
        program.version(pjson.version);
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

        programCommand.option('-d, --debug', 'activate debug mode');
        programCommand.option('-p, --profile', 'use a profile');
    }
}

export {ProgramBuilder};
