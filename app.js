const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const users = [];

server.listen(8000);

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    socket.on('new-user', (username) => {
        if(users.indexOf(username) != -1) {
            socket.emit('same-users', true);

        } else {
            socket.emit('same-users', false);
            socket.username = username;
            users.push(socket.username);
            io.emit('usern', users);

            socket.emit('message', `Witaj ${socket.username}`);

            socket.broadcast.emit('message', `${socket.username} dołączył do czatu!`);

            socket.on('disconnect', () => {
                const index = users.indexOf(socket.username);

                users.splice(index, 1);
                io.emit('usern', users);
                io.emit('message', `${socket.username} wyszedł!`);
            });
        }
    });

    /* socket.emit('message', `Witaj ${socket.username}`);

    socket.broadcast.emit('message', `${socket.username} dołączył do czatu!`);

    socket.on('disconnect', () => {
        const index = users.indexOf(socket.username);

        //users.splice();

        io.emit('message', `${socket.username} wyszedł!`);
    }); */
    socket.on('send-message', message => {
        io.emit('new-message', {message: message, username: socket.username});
    });
});