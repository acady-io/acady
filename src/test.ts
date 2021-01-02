import {FileHelper} from "./helpers/file-helper";

async function devAll() {
    await FileHelper.replaceSymlinks('/var/folders/7y/dnv0q0354dq5wfts76stl3s80000gp/T/tmp-52636-lm5tZD7BIF7X/example-rest-api-http-gateway/node_modules/');
}


devAll().then(() => {
    console.log("finished");
});
