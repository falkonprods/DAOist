# DAOist

Welcome to the DAOist. We are developing a new way for groups to organize. This concept, called Decentralized Autonomous Organizations, uses tokens to measure commitment and create an organization that is setup to empower action without having to know or trust anyone in the organization. This solves the problem of getting groups of people together that have a similar interest but don’t know one another well enough to trust and make decisions well — and to be able to do this remotely.

The way our system works is that “members” can register for the organization. They can receive tokens to register and can purchase additional tokens. These tokens can be used to confer trust onto other members by “liking” them (and thus transferring tokens to them).

The most critical aspect to our application is the use of ideas. Any member can create an idea. An idea is an actionable unit of work — it could be building a web site, launching a marketing plane, developing a feature — that has a cost and can be executed. A cost value in tokens (using USD equivalents, if desired). Members can vote on ideas by staking their tokens against it. Once the value is reached, then the tokens can be released to the person who posted the idea to execute.

## Screenshot

![DAOist Screenshot](https://drive.google.com/open?id=1WnJn9lUYrbmrVWiojjX8FHPqxCppWoxI)

## Packages
This project contains the following packages:

- [facade-counters](packages/facade-counters/README.md)
- [facade-profile](packages/facade-profile/README.md)
- [frontend](packages/frontend/README.md)
- [login](packages/login/README.md)
- [register](packages/register/README.md)
- [members](packages/members/README.md)

## Prerequisites
- AWS account with access to IAM and Lambda
- Node v8.10 (LTS)
- Yarn 1.4.2+
- Linux (recommended)

## Installation

```
yarn install
```

## Deployment:
For each function their is an entry in package.json to Create, Update and Destroy a Function on AWS Lambda.

The available commands for interacting with AWS are:

- `yarn run deploy <function>` Creates or updates a function and adds it to api gateway.
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

## License
See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
