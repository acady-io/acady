import {SelectOption} from "../dto/select-option";

const entityConnectors: SelectOption[] = [{
    name: 'AWS DynamoDB',
    id: 'dynamodb'
}, {
    name: 'Elasticsearch (Elastic Cloud)',
    id: 'elasticsearch'
}, {
    name: 'Cloudflare KV Storage',
    id: 'cloudflare_kv'
}];

export default entityConnectors;
