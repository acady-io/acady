const { filesystem } = require('gluegun/filesystem');

export class FileHelper {

    public static readUserFile(filename: string) {
        const sep = filesystem.separator;
        const path = filesystem.homedir() + sep + filename;
        return filesystem.read(path);
    }

}
