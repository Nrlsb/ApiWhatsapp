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
    const body = req.body;

    console.log('Incoming webhook message:', JSON.stringify(body, null, 2));

    // Check if this is an event from a page subscription
    if (body.object === 'whatsapp_business_account') {
        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(entry => {
            // Iterate over each change - there may be multiple
            entry.changes.forEach(change => {
                const value = change.value;

                // Check if there are messages
                if (value.messages && value.messages.length > 0) {
                    const message = value.messages[0];
                    const from = message.from;
                    const messageType = message.type;

                    console.log('------------------------------------------------');
                    console.log(`📩 NUEVO MENSAJE DE: ${from}`);

                    if (messageType === 'text') {
                        const messageBody = message.text.body;
                        console.log(`📝 TEXTO: ${messageBody}`);
                    } else {
                        console.log(`📎 TIPO: ${messageType}`);
                    }
                    console.log('------------------------------------------------');
                }
            });
        });

        res.sendStatus(200);
    } else {
        // Return a '404 Not Found' if event is not from a WhatsApp API
        res.sendStatus(404);
    }
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
