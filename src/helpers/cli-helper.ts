import {Component} from "../dto/component";
import {SelectOption} from "../dto/select-option";

const inquirer = require('inquirer');
export class CliHelper {

    private static inquirer;

    public static async prompt(question: any) {
        if (!question.name)
            question.name = 'default';

        if (!question.type)
            question.type = 'input';

        const answers = await CliHelper.getInquirer().prompt([question]);
        return answers[question.name];
    }

    public static getInquirer() {
        if (!CliHelper.inquirer) {
            CliHelper.inquirer = inquirer;
            CliHelper.inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
        }
        return inquirer;
    }

    public static getChoices(options: SelectOption[], component: Component) {
        options = options.filter(option => {
            const conditions = option.conditions;

            for (let condKey of Object.keys(conditions)) {
                let condValue: string[] = conditions[condKey];
                if (!Array.isArray(condValue))
                    condValue = [condValue];

                if (!condValue.includes(component[condKey]))
                    return false;
            }

            return true;
        });

        return options.map(option => {
            return {
                name: option.name,
                value: option.id
            };
        })
    }

}
