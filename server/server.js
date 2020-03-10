const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 4000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    // socket.emit('newEmail', {
    //     from: 'idam@example.com',
    //     text: 'Hey. What is going on.',
    //     createdAt: 123
    // });

    // socket.emit('newMessage', {
    //     from: 'john',
    //     text: 'See you then',
    //     createdAt: 12244
    // });

    // socket.on('createEmail', (newEmail) => {
    //     console.log('createEmail', newEmail);
    // });

    // socket.on('createMessage', (message) => {
		    //     console.log('createMessage', message)
            // });
            

    
        socket.on('join', (params, callback) => {
            if (!isRealString(params.name) || !isRealString(params.room)) {
               return callback('Name and room name are rquired.');
            }

            socket.join(params.room);
            users.removeUser(socket.id);
            users.addUser(socket.id, params.name, params.room);
            //Socket.leave('The office fans');


            //io.emit -> io.to('the office fans').emit
            io.to(params.room).emit('updateUserList', users.getUserList(params.room));
            //socket.broadcast.emit -> socket.broadcast.to('the office fans').emit
            //socket.emit

            //socket.emit from Admin text Welcome to the chat app
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    
        //socket.broadcast.emit from Admin text New user joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    

            callback();
        });

    socket.on('createMessage', (message, callback) => {
            var user = users.getUser(socket.id);

            if (user && isRealString(message.text)) {
                io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            }
            
        callback();
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if (users) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
       
    });




    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateLocationMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
console.log(`Server is up on ${port}`);
});