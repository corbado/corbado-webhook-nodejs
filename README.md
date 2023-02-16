# Description

This webhooks Node.js package can be used in your backend to handle webhook calls from Corbado.

The package handles webhooks authentication and takes care of the correct formatting of requests and responses. This allows you to focus on the actual implementation of the different actions.

# Installation
Run the following command in your project root directory:

```
npm install webhook-nodejs
```

Currently, the package is not yet published to the npm registry. To use it locally follow these steps:

1. Navigate to the root directory of the npm package and run:
```
npm pack
```
2. In the project, where you want to use the package, run the following command to install the `.tgz` file, which was created in the previous step:
```
npm install /path/to/your/webhook-nodejs.tgz
```
3. In your project, import the package with the following command:
```
const {Webhook, webhookMiddleware} = require('webhook-nodejs');
```


# Start the sample application
To start the sample application, run the following commands in the `/examples` directory:

```
npm install
node app.js
```

# Documentation
To learn how Corbado uses webhooks, please have a look at our [webhooks documentation](https://docs.corbado.com/helpful-guides/webhooks).

# Examples
See [examples](examples/app.js) for a very simple usage of the webhooks package.