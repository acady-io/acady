import {StorageService} from "../src/services/storage-service";

test('StorageService', async () => {
    const key = 'storageTest';
    const data = {test: 'YES'};

    await StorageService.storeStorage(key, data);
    const readData = await StorageService.loadStorage(key);

    expect(readData).toEqual(data);
});
