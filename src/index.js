const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// initialization

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// settings
app.set('port', process.env.PORT || 3000);

// middlewares

// sockets
require('./socket')(io);

// static files
app.use(express.static(path.join(__dirname, 'public')));
// server
server.listen(app.get('port'), () => {
    console.log('server on port ', app.get('port'));
});