import hostings from "../config/hostings";

export class HostingHelper {

    public static getHosting(id: string) {
        for (let hosting of hostings) {
            if (hosting.id === id)
                return hosting;
        }
    }

    public static getHostingName(id: string) {
        const hosting = HostingHelper.getHosting(id);
        return hosting.name;
    }
}
