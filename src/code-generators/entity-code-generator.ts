import {Entity} from "../dto/entity";
import {FileHelper} from "../helpers/file-helper";
import {ClassCodeGenerator} from "./class-code-generator";

export class EntityCodeGenerator {

    public static generateEntityCode(folder: string, entity: Entity) {
        const entityFolder = FileHelper.path([folder, 'src', 'entities']);
        const rows = entity.properties.map(property => {
            return `    ${property.name}: ${property.type}`;
        })
        ClassCodeGenerator.generateClass(entityFolder, entity.name, rows);
    }

}
