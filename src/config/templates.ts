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
    id: 'template-react-default',
    name: 'React Default Template',
    subtype: 'react',
    gitUrl: 'https://github.com/acady-io/template-react-default.git',
    author: 'christian.schab@web.academy'
}, {
    id: 'template-backend-library',
    name: 'Backend Library Template',
    subtype: 'backend_library',
    gitUrl: 'https://github.com/acady-io/template-backend-library.git',
    author: 'christian.schab@web.academy'
}, {
    id: 'template-rest-api-http-gateway',
    name: 'Rest API Http Gateway (AWS) Template',
    subtype: 'rest_api',
    hosting: 'aws_lambda',
    gitUrl: 'https://github.com/acady-io/template-rest-api-http-gateway.git',
    author: 'christian.schab@web.academy'
}, {
    id: 'template-sf-worker',
    name: 'Step Function Worker Template',
    subtype: 'sf_worker',
    hosting: 'aws_lambda',
    gitUrl: 'https://github.com/acady-io/template-sf-worker.git',
    author: 'christian.schab@web.academy'
},{
    id: 'template-sf-worker',
    name: 'SQS Worker Template',
    subtype: 'sqs_worker',
    hosting: 'aws_lambda',
    gitUrl: 'https://github.com/acady-io/template-sqs-worker.git',
    author: 'christian.schab@web.academy'
}, {
    id: 'template-stream-processor',
    name: 'Stream Processor Template',
    subtype: 'stream_processor',
    hosting: 'aws_lambda',
    gitUrl: 'https://github.com/acady-io/template-stream-processor.git',
    author: 'christian.schab@web.academy'
}];

export default templates;
