import slugify from "slugify";

export class StringHelper {

    public static slugify(input: string) {
        return slugify(input, {
            lower: true
        })
    }

    public static encodeBase64(input: string) {
        const buff = Buffer.from(input);
        return buff.toString("base64");
    }

    public static decodeBase64(input: string) {
        const buff = new Buffer(input, "base64");
        return buff.toString("utf8");
    }

    public static matchAll(input: string, regex) {
        const response = [];
        let m;
        while ((m = regex.exec(input)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                response[groupIndex] = match;
            });
        }

        return response;
    }

    public static camelToKebab(input: string) {
        return input.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    public static kebabToCamel(input: string) {
        let arr = input.split('-');
        let capital = arr.map(item=> item.charAt(0).toUpperCase() + item.slice(1).toLowerCase());
        let capitalString = capital.join("");
        return capitalString;
    }

    public static upperFirstLetter(input: string) {
        return input.substr(0, 1).toUpperCase() + input.substr(1);
    }

    public static lowerFirstLetter(input: string) {
        return input.substr(0, 1).toLowerCase() + input.substr(1);
    }

}
