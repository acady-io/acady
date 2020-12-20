import templates from "../config/templates";

export class TemplateHelper {

    public static getTemplate(templateId: string) {
        for (let template of templates) {
            if (template.id === templateId)
                return template;
        }
    }

    public static getTemplateName(templateId: string) {
        const template = TemplateHelper.getTemplate(templateId);
        return template.name;
    }
}
