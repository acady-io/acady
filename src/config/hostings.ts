import {SelectOption} from "../dto/select-option";

const hostings: SelectOption[] = [{
    id: 'aws_lambda',
    name: 'AWS Lambda',
    conditions: {
        type: 'backend'
    }
}, {
    id: 'cloudflare_workers',
    name: 'Cloudflare Workers',
    conditions: {
        subtype: [
            'rest_api',
            'edge_proxy'
        ]
    }
}, {
    id: 'cloudflare_workers_site',
    name: 'Cloudflare Workers Site',
    conditions: {
        subtype: [
            'flareact',
            'react',
            'bootstrap',
        ]
    }
}, {
    id: 'aws_s3_cloudfront',
    name: 'S3 + Cloudfront',
    conditions: {
        subtype: [
            'react',
            'bootstrap'
        ]
    }
}, {
    id: 'netlify',
    name: 'Netlify',
    conditions: {
        subtype: [
            'react',
            'bootstrap',
            'nextjs',
            'gatsby'
        ]
    }
}, {
    id: 'vercel',
    name: 'Vercel',
    conditions: {
        subtype: [
            'react',
            'bootstrap',
            'nextjs',
            'gatsby'
        ]
    }
}];


export default hostings;


