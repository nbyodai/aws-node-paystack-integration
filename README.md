# Paystack Integration Boilerplate

A simple boilerplate for Paystack integration using AWS Lambda and API Gateway to interact with the Paystack's webhook. Inspired by [stripe example](https://github.com/serverless/examples/blob/master/aws-node-stripe-integration/README.md)

## Use Cases

- Notified about events e.g. charge.success that happen in a Paystack account.
- Send email on such events

## Setup

### Install npm packages

```bash
$ npm install
```

### Edit `env.example` to `env.yml` and add your secret keys.

```bash
$ vi config/local.yaml
```

```yaml
TEST_SECRET_KEY: Paystack_Test_Secret_Key_here
LIVE_SECRET_KEY: Paystack_Live_Secret_Key_here
```

### Deploy!

```bash:production
$ serverless deploy
```

or development

```bash:development
$ serverless deploy -v --stage dev
```
