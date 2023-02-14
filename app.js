var express = require('express');
var app = express();
var cors = require('cors');
const basicAuth = require('./middleware/basic-auth');
const webhook = require('./webhook.js');

app.use(cors());
app.use(basicAuth);
app.use(express.json());

app.post('/webhooks', webhook.webhook);


app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
});



