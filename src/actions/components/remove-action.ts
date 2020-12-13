const logSymbols = require('log-symbols');

class RemoveAction {

    public static async removeApp(name: string) {
        try {
            console.log("Removing component " + name + " ...");

            console.log(logSymbols.success, "Component " + name + " removed!");
        } catch (e) {
            console.warn(logSymbols.error, e.message);
        }
    }
}

export {RemoveAction};
