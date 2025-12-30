const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to log ALL requests
app.use((req, res, next) => {
    const logMessage = `${new Date().toISOString()} - Received ${req.method} request to ${req.url}\n`;
    console.log(logMessage);
    fs.appendFileSync('webhook_logs.txt', logMessage);
    next();
});

app.use(bodyParser.json());

// Webhook Verification
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === config.WEBHOOK_VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400); // Bad Request if parameters are missing
    }
});

// Incoming Messages
app.post('/webhook', (req, res) => {
    console.log('Incoming webhook message:', JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server failed to start:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
