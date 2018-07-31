# vinzy-ost
This project contains the following packages:

- [facade-counters](packages/facade-counters/README.md)
- [facade-profile](packages/facade-profile/README.md)
- [frontend](packages/frontend/README.md)]
- [login](packages/frontend/README.md)]
- [register](packages/register/README.md)]

## Prerequisites
- AWS account with access to IAM and Lambda
- Node v8.10 (LTS)
- Yarn 1.4.2+
- Linux (recommended)

## installation

```
yarn install
```

## Configuration

- [AWS credentials](https://claudiajs.com/tutorials/installing.html#detailed-info-about-credentials)

## Environment variables
The `/.env.example` contains all the default environment variables development keys just copy it to `/.env`

For the production environment we can create an `/.env.production` file where we store all the production environment keys.

*special note* the  `/.env.production` production is required for deploying to a production environment
and `/.env` to development.

## Deployment:
For each function their is an entry in package.json to Create, Update and Destroy a Function on AWS Lambda.

The available commands for interacting with AWS are:

- `yarn run deploy <function>` Creates or updates a function and removes it from api gateway.
- `yarn run destroy <function>` Destroys the function and removes it from api gateway.

## Testing
For all packages unit tests are defined in `packages/*/test` and integration test in `packages/*/test-integration`.

All test should have the following file suffix: `*.test.js`

## Adding dependencies
For each package we can have local dependencies, to add one issue the following command

```
cd packages/<function>/
yarn add <name of package> --save
```

## Project dependencies
- Yarn [work spaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/) with [nohoist](https://yarnpkg.com/blog/2018/02/15/nohoist/)
- [Claudiajs](https://claudiajs.com/)
