// Import express module
const express = require('express');

// Import path module
const path = require('path');

// Import http module
const http = require('http');

// Import socket.io module
const socketio = require('socket.io');

// Import format message function
const formatMessage = require('./utils/messages');

// Import user functions
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./utils/users');

// Create express app
const app = express();

// Create server object
const server = http.createServer(app);

// Create web socket
const io = socketio(server);

// Store chat bot name
const botName = '[BOT] Nexoid';

// Set frontend root directory to the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Receive new connection from client
io.on('connection', (socket) => {
  // Receive join room event from client
  socket.on('joinRoom', ({ username, room }) => {
    // Add new user to users list
    addUser(socket.id, username, room);

    // Add new user to their selected room
    socket.join(room);

    // Emit join message to all users in the room
    io.to(room).emit(
      'message',
      formatMessage({
        username: botName,
        text: `${username} joined the room.`,
        isSender: false,
      })
    );

    // Emit room update event to all users in the room
    io.to(room).emit('roomUpdate', {
      room,
      users: getUsersInRoom(room),
    });
  });

  // Receive new chat message event from client
  socket.on('chatMessage', (message) => {
    // Get sender
    const user = getUser(socket.id);

    // Check if sender is connected to the web socket
    if (user) {
      // Store sender's username and room
      const { username, room } = user;

      // Emit message to the sender
      io.to(socket.id).emit(
        'message',
        formatMessage({
          username,
          text: message,
          isSender: true,
        })
      );

      // Emit message to the rest of the users in the room
      socket.to(room).emit(
        'message',
        formatMessage({
          username,
          text: message,
          isSender: false,
        })
      );
    }
  });

  // Receive disconnection event from client
  socket.on('disconnect', () => {
    // Remove disconnected user from users list
    const user = removeUser(socket.id);

    // Check if disconnected user was removed correctly
    if (user) {
      // Store disconnected user's username and room
      const { username, room } = user;

      // Emit disconnect message to the users in the room
      io.to(room).emit(
        'message',
        formatMessage({
          username: botName,
          text: `${username} left the room.`,
          isSender: false,
        })
      );

      // Emit room update event to all users in the room
      io.to(room).emit('roomUpdate', {
        room,
        users: getUsersInRoom(room),
      });
    }
  });
});

// Generate port number to run server on
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
