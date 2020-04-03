# Base Frontend Helpers ![version](https://img.shields.io/badge/version-1.18.3-blue)

[![N|Solid](https://avatars3.githubusercontent.com/u/39901497?s=200&v=4)](https://github.com/kakadu-dev)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/kakadu-dev/base-frontend-helpers)

Base Frontend Helpers is a package of necessary helpers for ReactJS/React-Native/Redux applications.
# The package includes helpers for:
  - API 
  - Firebase
  - Forms
  - Middleware
  - Redux-Saga
  - Services
  - Storage

## Installing

Base Frontend Helpers requires [![Node.js](https://img.shields.io/badge/Node-JS-brightgreen)](https://nodejs.org/en/) to run.

#### Clone the repo.

```sh
$ git clone https://github.com/kakadu-dev/base-frontend-helpers.git
```
or

#### Install the package.

```sh
$ npm install npm install @kakadu-dev/base-frontend-helpers@|CURRENT_VERSION|
```

#### Then install the dependencies and devDependencies.

```sh
$ cd base-frontend-components
$ npm install
```

## To publish the package:

#### Step 1: You need to change version of the package in package.json.

- example:

```sh
// What we have:
"version": "1.0.4",

// What we need:
"version": "1.0.5" or "version": "1.1.0" or "version": "2.0.0"
```

#### Step 2: Create access TOKEN or go to the next step if you already have it.
##### More info about GitHub access TOKEN:
###### [![GitHub TOKEN info](https://img.shields.io/badge/GitHub_Token-info-blueviolet)](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

#### Step 3: Authenticate.

```sh
// 1: Use this command:
$ npm login --registry=https://npm.pkg.github.com/

// 2: Enter your personal data:
> Username: USERNAME (Like in your GitHub profile)
> Password: TOKEN 
// You need to have TOKEN in: 
// Profile => Settings => Developer settings => Personal access tokens
> Email: PUBLIC-EMAIL-ADDRESS (Your GitHub email address)

That's it!

```

#### Step 4: Publish it!

```sh
$ npm publish
```

#### More info about GitHub packages here:

[![GitHub packages docs](https://img.shields.io/badge/GitHub_Packages-info-blueviolet)](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages)

## Built With

Base Frontend Components is currently extended with the following plugins. Instructions on how to use them in your own application are linked below.

| Plugin | README |
| ------ | ------ |
| Lodash | [Docs](https://lodash.com/docs/4.17.15) |
| Firebase | [Official Documentation](https://firebase.google.com/docs?hl=ru) |
| set-cookie-parser | [NPM Link](https://www.npmjs.com/package/set-cookie-parser) |
| Redux-Saga | [Tutorial](https://redux-saga.js.org/docs/introduction/BeginnerTutorial.html) 

License
----

Private
