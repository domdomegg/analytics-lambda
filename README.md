# 📊 analytics-lambda

Super simple serverless analytics. Just send events at it and it'll store them in an S3 bucket for 90 days.

## 📂 Components

- `lambda` - the serverless lambda code to deploy to AWS
- `vanilla` - example vanilla JS usage
- `tsreact` - example TypeScript and React usage
- `viewer` - an analytics event browser

## 📝 Usage

1. Deploy the contents of `lambda`
2. Start collecting events in your app, following the code samples in `vanilla` or `tsreact`
3. View the results in `viewer`
