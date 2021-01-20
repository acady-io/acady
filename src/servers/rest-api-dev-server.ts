import logSymbols = require("log-symbols");
import chalk from "chalk";
import {ApiBuilder} from "acady-api-builder";

const express = require('express');

export class RestApiDevServer {
    private apiBuilder: ApiBuilder;

    constructor(apiBuilder: ApiBuilder) {
        this.apiBuilder = apiBuilder;
    }

    public start() {
        return new Promise(resolve => {
            const expressApp = express();

            expressApp.use(express.json());

            expressApp.all('*', async (request, response) => {
                try {
                    console.log(chalk.grey('DevServer'), logSymbols.info, '> ' + request.method + ' ' + request.path);
                    // @ts-ignore
                    await this.apiBuilder.process(request, response, 'EXPRESS');
                    console.log(chalk.grey('DevServer'), logSymbols.info, '< ' + response.statusCode);
                } catch (e) {
                    console.log(e);
                    console.log(chalk.grey('DevServer'), logSymbols.warning, e);
                    response.status(500).send('Exception: ' + e.message);
                }
            });

            expressApp.listen('8400');
            console.log(chalk.grey('DevServer'), logSymbols.info, 'Dev Server started at: http://localhost:8400/');
        });
    }

}
