import {Template} from "../dto/template";

const templates: Template[] = [{
    id: 'template-gatsby-default',
    name: 'Gatsby.js Default Template',
    subtype: 'gatsby',
    gitUrl: 'https://github.com/acady-io/template-gatsby-default.git',
    author: 'christian.schab@web.academy'
}, {
    id: 'template-next-default',
    name: 'Next.js Default Template',
    subtype: 'nextjs',
    gitUrl: 'https://github.com/acady-io/template-next-default.git',
    author: 'christian.schab@web.academy'
}, {
    id: 'template-backend-library',
    name: 'Backend Library Template',
    subtype: 'backend_library',
    gitUrl: 'https://github.com/acady-io/template-backend-library.git',
    author: 'christian.schab@web.academy'
}];

export default templates;
