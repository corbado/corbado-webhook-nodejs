const express = require('express');
const cors = require('cors');
const basicAuth = require('./middleware/basic-auth');
const WebhookController = require('./controller/WebhookController.js');

const app = express();

app.use(cors());
app.use(basicAuth);
app.use(express.json());

app.post('/webhooks', WebhookController.handleWebhook);

function startServer() {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}


try {
    startServer();
} catch (err) {
    console.error('Error starting server: ', err)
}



