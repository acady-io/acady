import {Component} from "../../dto/component";
import simpleGit, {SimpleGit} from 'simple-git';
import logSymbols = require("log-symbols");
import {FileHelper} from "../../helpers/file-helper";
import {AcadyConfigHelper} from "../../helpers/acady-config-helper";

const username = require('username');
const fs = require('fs')
const fse = require('fs-extra');

export class SetupFolderAction {

    public static async setupFolder(component: Component) {

        const cwd = process.cwd();
        component.folder = FileHelper.path([cwd, component.id]);
        fs.mkdirSync(component.folder);

        console.log(logSymbols.info, 'Created folder ' + component.folder);

        const git: SimpleGit = simpleGit({
            baseDir: component.folder
        });
        await git.init();
        fse.copySync(component.templateDir, component.folder);

        await SetupFolderAction.setupPackageJson(component);
        await SetupFolderAction.setupAcadayJson(component);

        await git.add('*');
        await git.addRemote('origin', component.repository.gitUrl);
    }

    private static async setupPackageJson(component: Component) {
        const packageJson: any = JSON.parse(fs.readFileSync(FileHelper.path([component.folder, 'package.json'])));

        if (component.hosting.hostingProvider === 'npm')
            packageJson.name = component.hosting.providerData.npmFullPackage;
        else
            packageJson.name = component.id;

        packageJson.description = component.name;
        packageJson.author = await username();
        packageJson.repository = {
            type: 'git',
            url: component.repository.gitUrl
        };

        fs.writeFileSync(FileHelper.path([component.folder, 'package.json']), JSON.stringify(packageJson, null, 2) + "\n");
    }

    private static async setupAcadayJson(component: Component) {
        const acadyConfig = {...component}

        acadyConfig.folder = undefined;
        acadyConfig.templateDir = undefined;
        acadyConfig.status = undefined;

        AcadyConfigHelper.storeConfig(acadyConfig, component.folder);
    }
}
