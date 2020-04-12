const fs = require('fs');
var http = require('http');
const https = require('https');
var express = require('express');



// Yes, TLS is required
const HTTPS_PORT = process.env.HTTPS_PORT || 8443;
const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};






// Create a server for the client html page
var app = express();
app.use(express.static('client'));
app.get('/websockets_port',(req, res) => {res.json({port: HTTPS_PORT})})


const httpsServer = https.createServer(serverConfig, app);

httpsServer.listen(HTTPS_PORT, '0.0.0.0', null, () => {
  console.log(`HTTPS: App listening on port ${HTTPS_PORT}`);
  console.log('Press Ctrl+C to quit.');
});

const io = require('socket.io')(httpsServer, { origins: '*:*'});
io.origins('*:*') 
io.sockets.on('connection', function (socket) {
  console.log("Got connection");
  socket.on('new-channel', function (data) {
    console.log("Got new-channel", data);
      socket.broadcast.emit('message', data);
  });
  socket.on('message', function (data) {
    console.log("Got message", data);
      socket.broadcast.emit('message', data);
  });

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



console.log('\n\nServer running. Visit https://localhost:' + HTTPS_PORT + ' in Firefox/Chrome.\n\n');