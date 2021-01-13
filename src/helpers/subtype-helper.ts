import subtypes from "../config/subtypes";
import chalk from "chalk";

export class SubtypeHelper {

    public static getSubtype(id: string) {
        for (let subtype of subtypes) {
            if (subtype.id === id)
                return subtype;
        }
    }

    public static getSubtypeName(id: string) {
        const subtype = SubtypeHelper.getSubtype(id);
        if (!subtype)
            throw new Error("I don't know the (sub-)type " + chalk.red(id) + " yet!");

        return subtype.name;
    }

}
