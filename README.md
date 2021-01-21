# 📊 analytics-lambda

Super simple serverless analytics. Just send events at it and it'll store them in an S3 bucket for 90 days.

## Setup

```
npm install -g serverless
```

```
serverless deploy -v --stage dev
```

## Usage

From a browser:

```js
const endpointUrl = 'https://fghxabnlad.execute-api.eu-west-1.amazonaws.com/';
const project = 'my_project';
const streamId = Math.random().toString(36).slice(2);

fetch(endpointUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project, streamId, data: { name: 'load' } })
});
```