import {Component} from "../../dto/component";
import templates from "../../config/templates";
import {CliHelper} from "../../helpers/cli-helper";
import {TemplateHelper} from "../../helpers/template-helper";

const tmp = require('tmp');
import simpleGit, {SimpleGit} from 'simple-git';
import logSymbols = require("log-symbols");
import {FileHelper} from "../../helpers/file-helper";

const rimraf = require("rimraf");

export class SetupTemplateAction {

    public static async setupTemplate(component: Component) {

        const availableTemplates = templates.filter(template => {
            if (template.subtype !== component.subtype)
                return false;

            return true;
        });

        if (!component.template)
            component.template = await CliHelper.prompt({
                type: 'list',
                message: 'Which template shall be used?',
                choices: availableTemplates.map(template => {
                    return {
                        name: template.name,
                        value: template.id
                    }
                })
            })

        if (!component.templateDir)
            component.templateDir = await SetupTemplateAction.downloadTemplate(component);
    }


    private static async downloadTemplate(component: Component): Promise<string> {
        const template = TemplateHelper.getTemplate(component.template);
        if (!template)
            throw new Error('Cannot find template ' + component.template);

        const tmpDir = tmp.dirSync();
        const git: SimpleGit = simpleGit({
            baseDir: tmpDir.name
        });

        console.log(logSymbols.info, 'Download Template from ' + template.gitUrl);
        await git.clone(template.gitUrl);
        const templateDir = FileHelper.path([tmpDir.name, template.id]);

        rimraf.sync(FileHelper.path([templateDir, '.git']));

        return templateDir;
    }
}
