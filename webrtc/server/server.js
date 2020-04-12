const fs = require('fs');
var http = require('http');
const https = require('https');
var express = require('express');

const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

// Yes, TLS is required
const HTTPS_PORT = process.env.HTTPS_PORT || 8443;
const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

// ----------------------------------------------------------------------------------------

// Create a server for the client html page
var app = express();
app.use(express.static('client'));
app.get('/websockets_port',(req, res) => {res.json({port: HTTPS_PORT})})


const httpsServer = https.createServer(serverConfig, app);

httpsServer.listen(HTTPS_PORT, '0.0.0.0', null, () => {
  console.log(`HTTPS: App listening on port ${HTTPS_PORT}`);
  console.log('Press Ctrl+C to quit.');
});



const HTTP_PORT = process.env.HTTP_PORT || 8080;
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(HTTP_PORT, null, () => {
  console.log(`HTTP: App listening on port ${HTTP_PORT}`);
  console.log('Press Ctrl+C to quit.');
});



// ----------------------------------------------------------------------------------------

// Create a server for handling websocket calls
const wss = new WebSocketServer({server: httpsServer});

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    // Broadcast any received message to all clients
    console.log('received: %s', message);
    wss.broadcast(message);
  });
});

wss.broadcast = function(data) {
  this.clients.forEach(function(client) {
    if(client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

console.log('\n\nServer running. Visit https://localhost:' + HTTPS_PORT + ' in Firefox/Chrome.\n\n');