import {StorageService} from "../src/services/storage-service";
import {FileHelper} from "../src/helpers/file-helper";


/*
test('StorageService', async () => {
    const key = 'storageTest';
    const data = {test: 'YES'};

    await StorageService.storeStorage(key, data);
    const readData = await StorageService.loadStorage(key);

    expect(readData).toEqual(data);
});
*/

test('FileHelper.replaceSymlinks', async () => {
    const folder = '/var/folders/7y/dnv0q0354dq5wfts76stl3s80000gp/T/tmp-52636-lm5tZD7BIF7X/example-rest-api-http-gateway/node_modules/';

    await FileHelper.replaceSymlinks(folder);
})
