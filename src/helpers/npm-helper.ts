import {ExecHelper} from "./exec-helper";

export class NpmHelper {

    public static async install(cwd: string, args?: string[]) {
        await ExecHelper.pipe('npm',['install', ...args], cwd);
    }

    public static async run(script: string, cwd: string) {
        await ExecHelper.pipe('npm', ['run', script], cwd);
    }


}
