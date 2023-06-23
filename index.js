require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.port || 8080;
const {dbService} = require('./services/db-service')
const bodyParser = require('body-parser')
const webSocket = require('ws');
const http = require('http');
const server = http.createServer(express)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://emxanuel.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(bodyParser.json())
require('./routes')(app, dbService())

const wss = new webSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', () => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === webSocket.OPEN){
                client.send('')
            }
        })
    })
})

app.listen(port, () => {
    console.log("app listen in port: " + port)
})

server.listen(81, () => {
    console.log('app listen in port 81')
})