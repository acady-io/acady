import {StorageService} from "./storage-service";
import {Project} from "../dto/project";
import {nanoid} from 'nanoid';

class ProjectService {
    public static listProjects(): Project[] {
        return StorageService.loadStorage('projects') || [];
    }

    public static storeProjects(projects: Project[]) {
        StorageService.storeStorage('projects', projects);
    }

    public static createProject(projectName: string, projectKey: string) {
        if (ProjectService.loadProject(projectName)) {
            throw new Error('Project ' + projectName + ' already exists!');
        }

        const project: Project = {
            name: projectName,
            id: nanoid(),
            key: projectKey
        };

        const projectList = ProjectService.listProjects();
        projectList.push(project);
        ProjectService.storeProjects(projectList);
        return project;
    }

    public static removeProject(projectName: string) {
        let projects = ProjectService.listProjects();
        let filteredProjects = projects.filter(project => project.name !== projectName && project.id !== projectName && project.key !== projectName);
        if (projects.length == filteredProjects.length)
            throw new Error('Project ' + projectName + ' not found!');

        ProjectService.storeProjects(filteredProjects);
    }

    public static loadProject(projectName: string): Project {
        const projects = ProjectService.listProjects();

        for (let project of projects) {
            if (project.name == projectName || project.id == projectName)
                return project;
        }
        return null;
    }
}

export {ProjectService};
