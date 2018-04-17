# Firebase Cloud Functions

How to setup, test, and continuously deploy Firebase Cloud Function v1.0

# Table of Contents
* [Setup](#setup)
  * [Firebase CLI](#authenticate-the-firebase-cli)
  * [Initialize Project](#initialize-the-project-directory)
  * [Obtain service account credentials](#obtain-service-account-credentials)

## Setup

To learn how to get started with Cloud Functions for Firebase by having a look at their
[Getting Started Guide][functions_guide], trying the [quickstart samples][functions_quickstarts]
and looking at [the documentation][functions_docs].

1. Install [Node.js v8.10.0 or greater][node]

1. Install Node.js dependencies

    This will install everything required to setup, test, and deploy this repository:

        npm install

### Authenticate the [Firebase CLI][firebase_cli_reference]

  ```
  npm run firebase:login
  ```

  ```
  > firebase-functions-unittest-cd@1.0.0 firebase:login /home/ubuntu/workspace/firebase-functions-unittest-cd
  > npm run firebase -- login --no-localhost


  > firebase-functions-unittest-cd@1.0.0 firebase /home/ubuntu/workspace/firebase-functions-unittest-cd
  > firebase "login" "--no-localhost"

  ? Allow Firebase to collect anonymous CLI usage and error reporting information? Yes

  Visit this URL on any device to log in:
  https://accounts.google.com/o/oauth2/auth?client_id=...

  ? Paste authorization code here: 4/my-auth-code

  ✔  Success! Logged in as jeremylorino@gmail.com
  ```

### Initialize the project directory

  ```
  npm run firebase:init:functions
  ```

  ```
  > firebase-functions-unittest-cd@1.0.0 firebase:init:funcs /home/ubuntu/workspace/firebase-functions-unittest-cd
  > npm run firebase -- init functions


  > firebase-functions-unittest-cd@1.0.0 firebase /home/ubuntu/workspace/firebase-functions-unittest-cd
  > firebase "init" "functions"


       ######## #### ########  ######## ########     ###     ######  ########
       ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
       ######    ##  ########  ######   ########  #########  ######  ######
       ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
       ##       #### ##     ## ######## ########  ##     ##  ######  ########

  You're about to initialize a Firebase project in this directory:

    /home/ubuntu/workspace/firebase-functions-unittest-cd


  === Project Setup

  First, let's associate this project directory with a Firebase project.
  You can create multiple project aliases by running firebase use --add,
  but for now we'll just set up a default project.

  ? Select a default Firebase project for this directory: (Use arrow keys)
    [don't setup a default project]
  ❯ My Firebase Project (myproject-198914)
    [create a new project]
  ```

  ```
  === Functions Setup

  A functions directory will be created in your project with a Node.js
  package pre-configured. Functions can be deployed with firebase deploy.

  ? What language would you like to use to write Cloud Functions?
    JavaScript
  ❯ TypeScript
  ```

  ```
  ? Do you want to use TSLint to catch probable bugs and enforce style? Yes
  ✔  Wrote functions/package.json
  ✔  Wrote functions/tslint.json
  ✔  Wrote functions/tsconfig.json
  ✔  Wrote functions/src/index.ts
  ? Do you want to install dependencies with npm now? Yes

  > grpc@1.10.1 install /home/ubuntu/workspace/firebase-functions-unittest-cd/functions/node_modules/grpc
  > node-pre-gyp install --fallback-to-build --library=static_library

  [grpc] Success: "/home/ubuntu/workspace/firebase-functions-unittest-cd/functions/node_modules/grpc/src/node/extension_binary/node-v57-linux-x64-glibc/grpc_node.node" is installed via remote

  > protobufjs@6.8.6 postinstall /home/ubuntu/workspace/firebase-functions-unittest-cd/functions/node_modules/google-gax/node_modules/protobufjs
  > node scripts/postinstall


  > protobufjs@6.8.6 postinstall /home/ubuntu/workspace/firebase-functions-unittest-cd/functions/node_modules/google-proto-files/node_modules/protobufjs
  > node scripts/postinstall


  > firebase-functions@1.0.1 postinstall /home/ubuntu/workspace/firebase-functions-unittest-cd/functions/node_modules/firebase-functions
  > node ./upgrade-warning


  ======== WARNING! ========

  This upgrade of firebase-functions contains breaking changes if you are upgrading from a version below v1.0.0.

  To see a complete list of these breaking changes, please go to:

  https://firebase.google.com/docs/functions/beta-v1-diff

  npm notice created a lockfile as package-lock.json. You should commit this file.
  added 570 packages from 469 contributors in 29.528s

  i  Writing configuration info to firebase.json...
  i  Writing project information to .firebaserc...

  ✔  Firebase initialization complete!
  ```

### Obtain service account credentials

  * Go to API Manager -> Credentials
  * Click "New Credentials", and create a service account or [click here](https://console.cloud.google.com/project/_/apiui/credential/serviceaccount)
  * Download the JSON for this service account, and set the `GOOGLE_APPLICATION_CREDENTIALS`
  environment variable to point to the file containing the JSON credentials.

  Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable:

  Linux:

    export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account_file.json

  Windows:

    set GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account_file.json

  Windows (PowerShell):

    $env:GOOGLE_APPLICATION_CREDENTIALS="/path/to/service_account_file.json"

  Read more about [Google Cloud Platform Authentication][gcp_auth].




[functions_guide]: https://firebase.google.com/docs/functions/get-started
[functions_docs]: https://firebase.google.com/docs/functions
[functions_quickstarts]: https://github.com/firebase/functions-samples/tree/master/quickstarts
[firebase_cli_reference]: https://firebase.google.com/docs/cli/
[node]: https://nodejs.org/
[auth_command]: https://cloud.google.com/sdk/gcloud/reference/beta/auth/application-default/login
[gcp_auth]: https://cloud.google.com/docs/authentication#projects_and_resources



