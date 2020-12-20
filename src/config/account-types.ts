import {AccountType} from "../dto/account-type";

const accountTypes: AccountType[] = [{
    id: 'aws',
    name: 'Amazon WebServices'
}, {
    id: 'cloudflare',
    name: 'Cloudflare'
}, {
    id: 'netlify',
    name: 'Netlify'
}, {
    id: 'vercel',
    name: 'Vercel'
}, {
    id: 'github',
    name: 'Github'
}, {
    id: 'gitlab',
    name: 'GitLab'
}, {
    id: 'bitbucket',
    name: 'Bitbucket'
}];

export default accountTypes;
