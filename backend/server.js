const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

let codeContent = ''; // Stores shared code

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send current code to new users
    socket.emit('loadCode', codeContent);

    // Handle code changes
    socket.on('codeChange', (newCode) => {
        codeContent = newCode;
        socket.broadcast.emit('codeUpdate', newCode);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(5000, () => console.log('Server running on port 5000'));
