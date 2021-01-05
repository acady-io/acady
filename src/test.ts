import {FileHelper} from "./helpers/file-helper";

async function devAll() {
    await FileHelper.createFolderIfNotExists('/Users/schab/Development/PBAA/pbaa-backend-library/entities');
}


devAll().then(() => {
    console.log("finished");
});
