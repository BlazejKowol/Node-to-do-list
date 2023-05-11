const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
let tasks = [];

app.use((req, res) => {
    res.status(404).send('Not found...');
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('connected' + socket.id);
    socket.broadcast.emit('updateData', tasks);

    socket.on('addTask', (data) => {
        tasks.push({name: data.name, id: socket.id});
        socket.broadcast.emit('addTask', data);
    });

    socket.on('removeTask', (taskId) => {
        tasks = tasks.filter(task => task.id !== taskId);
        socket.broadcast.emit('removeTask', taskId);
    });
});
