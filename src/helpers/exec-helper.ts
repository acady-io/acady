const execa = require('execa');
import logSymbols = require("log-symbols");

export class ExecHelper {

    public static async pipe(command: string, args: string[], cwd: string) {
        return new Promise((resolve, reject) => {
            const cmd = execa(command, args, {
                cwd,
                stdio: 'inherit'
            });

            cmd.on('close', (code) => {
                if (code !== 0)
                    reject();
                else
                    resolve();
            })

            process.once('SIGINT', function (code) {
                console.log(logSymbols.warning, 'acady is exiting ' + command);
                cmd.kill('SIGTERM', {
                    forceKillAfterTimeout: 2000
                });
            });

            process.once('SIGTERM', function (code) {
                console.log(logSymbols.warning, 'acady is exiting ' + command);
                cmd.kill('SIGTERM', {
                    forceKillAfterTimeout: 2000
                });
            });
        });
    }

    public static async exec(command: string, args: string[], cwd: string) {
        return new Promise((resolve, reject) => {
            const cmd = execa(command, args, {
                cwd,
            });

            cmd.stdout.on('data', (data) => {
                console.log('\x1b[90m' + '['+command+']' + '\x1b[0m', logSymbols.info, data.toString().trim());
            });
            cmd.stderr.on('data', (data) => {
                if (data.toString !== 'npm')
                    console.log('\x1b[90m' + '['+command+']' + '\x1b[0m', logSymbols.warning, data.toString().trim());
            });
            cmd.on('close', (code) => {
                if (code !== 0)
                    reject();
                else
                    resolve();
            })
        });
    }
}
