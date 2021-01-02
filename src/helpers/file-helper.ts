const { filesystem } = require('gluegun/filesystem');

export class FileHelper {

    public static readUserFile(filename: string) {
        const sep = filesystem.separator;
        const path = filesystem.homedir() + sep + filename;
        return filesystem.read(path);
    }

    public static path(parts: string[]) {
        return parts.join(filesystem.separator);
    }


    public static replaceSymlinks(folder: string) {
        if (!folder.endsWith(filesystem.separator)) {
            folder += filesystem.separator;
        }
        const files: string[] = filesystem.list(folder);

        if (!files)
            return;

        for (let file of files) {
            if (file.startsWith("."))
                continue;

            if (file.startsWith('@')) {
                FileHelper.replaceSymlinks(folder + file);
                continue;
            }

            const details = filesystem.inspect(folder + file);

            if (details.type === 'symlink') {
                filesystem.remove(folder + file);
                filesystem.copy(folder + details.pointsAt, folder + file);
            }
        }
    }
}
