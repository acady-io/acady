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

}
