const endpointUrl = 'https://yourprefix.execute-api.eu-west-1.amazonaws.com/';
const project = 'my-project';
const streamId = Math.random().toString(36).slice(2);

export const a = (data: any) => fetch(endpointUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project, streamId, data }) })

export default a;