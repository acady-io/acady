const { filesystem } = require('gluegun/filesystem');

class StorageService {

    public static loadStorage(key: string): any {
        const path = StorageService.path(key);
        if (filesystem.exists(path)) {
            return filesystem.read(path, 'json');
        }
    }

    public static storeStorage(key: string, data: any) {
        const path = StorageService.path(key);
        filesystem.write(path, JSON.stringify(data));
    }

    public static removeStorage(key: string) {
        const path = StorageService.path(key);
        filesystem.remove(path);
    }

    private static path(key: string) {
        const folder = StorageService.folder();
        const path = folder + key + '.json';
        return path;
    }

    private static folder() {
        const sep = filesystem.separator;
        const folderPath = filesystem.homedir() + sep + '.acady' + sep;
        filesystem.dir(folderPath);
        return folderPath;
    }
}

export {StorageService};
