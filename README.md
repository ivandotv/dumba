# TypeScript \* Babel \* Jest \* Rollup Quick Start Template

Opinionated template repository for creating Javascript libraries with Typescript, Rollup, Babel, and Jest.

## Getting Started

You can immediately create your repo by clicking on the `Use this template` button in the Github page UI.
Or you can use [deGit](https://github.com/Rich-Harris/degit) which is a very convenient tool to quickly download the repository (without git clone) `degit https://github.com/ivandotv/node-module-typescript`

## Table of Contents

- [Motivation](#motivation)
- [Compiling Typescript via Babel](#typescript-via-babel)
- [Development Only Code](#development-only-code)
- [Rollup configuration](#rollup)
- [Jest Testing](#jest-testing)
- [ESLint and Prettier](#eslint-and-prettier)
- [Continous Integration](#continous-integration)
- [Git Hooks](#git-hooks)
- [Debugging](#debugging)
- [Nodemon](#nodemon)
- [Conventional Commits](#Conventional-commits)
- [Semantic Release](#semantic-release)
- [Generating Documentation](#generating-documentation)
- [Renovate Bot](#renovate-bot)
- [Build](#build)
- [Publish](#publish)

### Motivation

Setting up a modern Typescript or Javascript development stack is a daunting task, there are a lot of moving parts, and sometimes the whole process seems like magic. I wanted the create a modern javascript stack from scratch so I can better familiarize myself with the tools that go into the stack. There some pre-built tools like [tsdx cli](https://tsdx.io/) or [microbundle](https://github.com/developit/microbundle) however, I find myself always modifying the generated configuration, by adding another build target, eslint rule, etc...
With this template repository I am also handling automatic publishing to NPM, continuous integration, debugging etc..

This repository is actively maintained and as new versions of tools are being released it is updated and modified accordingly.

### Compiling Typescript via Babel

Typescript files are compiled via babel, which makes compilation a lot faster. However, as a consequence typescript types are not type-checked. Fear not there are scripts (`type:check` and `type:check:watch`) to check and watch for typescript errors.

#### Build targets

There are two build targets: `server` and `browser`. The reason for this distinction is because code for the `browser` is passed through Rollup and only one file is created. These build targets are determined by the `buildTarget` field in the `package.json`. Please note that the generated files will have the name something like: `yourLib.production.min.js` where `yourLib` is the name that is picked up by parsing the `package.json` `name` field.

##### Target: Server

Babel is set to compile two versions of your source code (with no polyfills):

- `server:build:cjs` (common js) which targets node `v12`
- `server:build:esm` (ES6) which targets node `v12`

Depending on if the `NODE_ENV` is set to `production` or `development` different babel plugins will be loaded ( production plugins will do dead code elimination).

There is also watch mode `server:watch` which compiles to your `current` version of node.

Full build of the `server` target is done via `server:build`

#### Target: Browser

When compiling for the `browser` there are a few different versions created.

- `browser:build:cjs` This will build a `common module version` that will have a `production` and `development` file like this:

```js
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./yourLib.production.min.js')
} else {
  module.exports = require('./yourLib.development.js')
}
```

This is great for your end-users since they can have a better developer experience while building their software, but when it's time to build the final bundle (include your lib in their code) `production` version will be used.

Rollup is used to compile and bundle the code for the browser. Rollup configuration compiles:

- `umd` versions with and without polyfills
- `esm` versions for modern browsers with and without polyfills. Version without polyfills will be referenced by `package.json` `module` field.

For `umd` version browser targets are: `['>0.2%', 'not dead', 'not op_mini all']` (same as create-react-app)

**Peer dependencies will not be bundled**!

### Development only code

While in the development your can the `__DEV__` expression to write code that will be stripped out from the production build.

this code:

```js
if (__DEV__) {
  //dev only code
}
```

will generate:

```js
if (process.env.NODE_ENV !== 'production') {
  //dev only code
}
```

Which will later (in `production` mode) be resolved to:

```js
if (false) {
  //dev only code
}
```

And it will be removed from your `production` build by `rollup` (in case of the `browser` build) or by `minify-dead-code-elimination` babel plugin (in case of the `server` build).

There are also some other expressions that you can use:

- `__VERSION__` is replaced with the environment variable `PKG_VERSION` or with `package.json` `version` field.
- `__COMMIT_SHA__` is replaced with the short version of the git commit sha from the HEAD.
- `__BUILD_DATE__` is replaced with the date of the commit from the HEAD.

### Jest Testing

Jest is used for testing. You can write your tests in Typescript and they will be compiled via babel for the nodejs version that is running the tests. The testing environment is set to `node` you might want to change that if you need access to `DOM` in your tests.
I think there is no faster way to run typescript tests in jest. :)

The coverage threshold is set to `80%` globally.

Two plugins are added to jest:

- `jest-watch-typeahead` (for filtering tests by file name or test name)
- `jest-junit` for reporting coverage.

There are three tasks for running tests:

- `test` run all test and report code coverage
- `test:ci` basically the same as `test` only optimized for CI (will not run in parallel)
- `test:watch` continuously run tests by watching some or all files

### ESLint and Prettier

-ESLint is set up with three plugins:

- `@typescript-eslint/eslint-plugin` for linting Typescript.
  `eslint-plugin-tsdoc` for linting markdown files.
  `prettier` for prettier integration

- There are a few overrides that I think are common sense. You can see the overrides inside the [.eslintrc.js](.eslintrc.js) file.

- You can run ESLint via `fix:src` and `fix:tests` scripts. `fix` script will run both of them.

### Continous Integration

You can choose between Github actions and CircleCI.

#### CircleCI

[CircleCI](https://circleci.com/) is used for continuous integration.

Tests are run for node versions 10, 12, and 14.

CircleCI is also set up to upload code coverage to [codecov.io](https://codecov.io) however you can also use [coveralls](https://coveralls.io) for code coverage ( it's currently commented out).

#### Github Actions

Same as CircleCI.
Github actions can also run `semantic-release` and automatically publish the library to NPM.
Don't forget to set up NPM and code coverage tokens (via GitHub secrets).

### Git Hooks

There is one git hook setup via [husky](https://www.npmjs.com/package/husky) package in combination with [lint-staged](https://www.npmjs.com/package/lint-staged). Before committing the files all staged files will be run through ESLint and Prettier.

### Debugging

If you are using VS Code as your editor,
there are three debug configurations:

- `Main` debug the application by running the compiled `index.js` file.
- `Current test file` debug currently focused test file inside the editor.
- `Nodemon` attach a debugger to the `nodemon`

### Nodemon

Nodemon is set to watch `dist/cjs` directory (where ES5 compile code is saved) and it will automatically reload `index.js`

### Conventional Commits

If you are not using [Conventional commits specifiction](https://www.conventionalcommits.org/en/v1.0.0/) for your commit messages, you should. Conventional commits CLI client is installed and it can be run by `yarn commit`.

### Semantic Release

The semantic release works together with the conventional commits specification and it is set up to automatically publish to NPM via CI.
There is a custom configuration (`.releaserc.js`) that will also trigger a release under these conditions:

- `docs(readme):` - will trigger a **patch** release
- `refactor` - will trigger a **patch** release

### Generating documentation

You can generate documentation for your source files via [typedoc](https://typedoc.org)(`yarn docs`).
Currently, documentation will be generated into `docs/api` directory and it is generated in markdown so it can be displayed on Github.

- Private members are excluded.
- Only exported properties are documented.

### Renovate Bot

There is a renovate bot configuration file for automatically updating dependencies. Make sure to active `renovate bot` first via [github marketplace.](https://github.com/marketplace/renovate)

### Build

For the final build just run `yarn build` and it will type check Typescript files, test all the files, and finally depending on the `buildTarget` from the `package.json` file it will build the [appropriate bundles.](#build-targets)

### Publish

Manual publishing is done via `yarn publish` this task will go through regular NPM publish steps. When publishing via continuous integration, a `semantic-release` package will be used. Both versions will call [`prepublishOnly` life cycle script](https://docs.npmjs.com/cli/v7/using-npm/scripts#life-cycle-scripts).
