require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const users = [{}];

const app = express();
app.use(cors());


app.get('/', (req, res) => {
    res.send("Hello from the chat server!");
});

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined`);

        socket.broadcast.emit('userjoined', {
            user: "Admin",
            message: `${users[socket.id]} has joined`
        });

        socket.emit('welcome', {
            user: "Admin",
            message: `Welcome to the chat ${users[socket.id]}`
        });
    });

    socket.on('message', ({ message, id }) => {
        io.emit('send-message', { user: users[id], message, id });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', {
            user: "Admin",
            message: `${users[socket.id]} has left`
        });
        console.log(`${users[socket.id]} disconnected`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
