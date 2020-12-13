import {StorageService} from "./storage-service";
import {App} from "../dto/app";
import {nanoid} from 'nanoid';

class AppService {
    public static listApps(): App[] {
        return StorageService.loadStorage('apps') || [];
    }

    public static storeApps(apps: App[]) {
        StorageService.storeStorage('apps', apps);
    }

    public static createApp(appName: string) {
        if (AppService.loadApp(appName)) {
            throw new Error('App ' + appName + ' already exists!');
        }

        const app: App = {
            name: appName,
            id: nanoid()
        };

        const appList = AppService.listApps();
        appList.push(app);
        AppService.storeApps(appList);
        return app;
    }

    public static removeApp(appName: string) {
        let apps = AppService.listApps();
        let filteredApps = apps.filter(app => app.name !== appName && app.id !== appName);
        if (apps.length == filteredApps.length)
            throw new Error('App ' + appName + ' not found!');

        AppService.storeApps(filteredApps);
    }

    public static loadApp(appName: string): App {
        const apps = AppService.listApps();

        for (let app of apps) {
            if (app.name == appName || app.id == appName)
                return app;
        }
        return null;
    }
}

export {AppService};
