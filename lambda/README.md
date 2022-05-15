# ⚡ analytics-lambda/lambda

Contains the serverless code to run in AWS to record the events

Effectively records whatever you send to the API Gateway endpoint to S3

## Setup

```
npm install
```

## Deploy

```
npm run deploy:dev
```

## API reference

`POST /` - will store whatever the contents of data are to the S3 bucket under a path `/some_project/some_stream/timestamp.json`

Request body

```json
{
    "project": "some_project",
    "streamId": "some_stream",
    "data": { "some_key": "some_value" }
}
```

Request body TypeScript definition
```ts
interface AnalyticsLambdaRequest {
    project: string;  // /^[a-zA-Z0-9_-]+$/
    streamId: string; // /^[a-zA-Z0-9_-]+$/
    data: any;
}
```

Response codes:

| Code | Meaning | Response body |
| - | - | - |
| 204 | Recorded successfully | < no content > |
| 400 | Bad request | `{ "statusCode": 400, "body": { "message": "Some explanation" } }` |
| 503 | Server error | `{ "statusCode": 503, "body": { "message": "Some explanation" } }` |
