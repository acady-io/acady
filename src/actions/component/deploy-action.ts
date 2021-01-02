import {Command} from "commander";
import {AcadyConfigHelper} from "../../helpers/acady-config-helper";
import {VercelDeployer} from "../../deployers/vercel-deployer";
import {LambdaDeployer} from "../../deployers/lambda-deployer";

export class DeployAction {

    public static async deploy(cmdObj: Command) {
        let folder = process.cwd();
        let stage = cmdObj.stage || 'prod';
        await DeployAction.deployFolder(folder, stage);
    }

    public static async deployFolder(folder, stage) {
        let acadyConfig = AcadyConfigHelper.getConfig(folder);
        if (!acadyConfig)
            return;

        switch (acadyConfig.hosting.hostingProvider) {
            case "vercel":
                await VercelDeployer.deployVercel(acadyConfig, folder, stage);
                break;
            case "aws_lambda":
                await LambdaDeployer.deployLambda(acadyConfig, folder, stage);
                break;
        }
    }
}
