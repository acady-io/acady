import subtypes from "../config/subtypes";

export class SubtypeHelper {

    public static getSubtype(id: string) {
        for (let subtype of subtypes) {
            if (subtype.id === id)
                return subtype;
        }
    }

    public static getSubtypeName(id: string) {
        const subtype = SubtypeHelper.getSubtype(id);
        return subtype.name;
    }

}
