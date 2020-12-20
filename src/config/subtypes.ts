import {Subtype} from "../dto/subtype";

const subtypes: Subtype[] = [{
    id: 'rest_api',
    name: 'REST API',
    type: 'backend',
    conditions: {
        type: 'backend'
    }
}, {
    id: 'task_worker',
    name: 'Task Worker (SQS, Step Functions, ...)',
    type: 'backend',
    conditions: {
        type: 'backend'
    }
}, {
    id: 'edge_proxy',
    name: 'Edge Proxy (Lambda@Edge, Cloudflare Workers, ...)',
    type: 'backend',
    conditions: {
        type: 'backend'
    }
}, {
    id: 'stream_processor',
    name: 'Stream Processor (Kinesis, DynamoDB, ...)',
    type: 'backend',
    conditions: {
        type: 'backend'
    }
}, {
    id: 'event_processor',
    name: 'Event Processor (Eventbridge, SNS, S3 Events, ...)',
    type: 'backend',
    conditions: {
        type: 'backend'
    }
}, {
    id: 'react',
    name: 'React Web App',
    type: 'backend',
    conditions: {
        type: 'frontend'
    }
}, {
    id: 'nextjs',
    name: 'Next.js Web App',
    type: 'backend',
    conditions: {
        type: 'frontend'
    }
}, {
    id: 'gatsby',
    name: 'Gatsby.js Web App',
    type: 'backend',
    conditions: {
        type: 'frontend'
    }
}, {
    id: 'flareact',
    name: 'Flareact Web App',
    type: 'backend',
    conditions: {
        type: 'frontend'
    }
}, {
    id: 'bootstrap',
    name: 'Simple Bootstrap Web App',
    type: 'backend',
    conditions: {
        type: 'frontend'
    }
}];

export default subtypes;


