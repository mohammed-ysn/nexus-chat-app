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

// Create express app
const app = express();

// Create server object
const server = http.createServer(app);

// Create web socket
const io = socketio(server);

// Store chat bot name
const botName = '[BOT] Nexoid';

// Store usernames
const users = [];

// Set frontend root directory to the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Receive new connection from client
io.on('connection', (socket) => {
  // Receive join event from client
  socket.on('join', (username) => {
    // Add new user's name to users list
    users.push(username);

    // Emit join message to all users
    io.emit(
      'message',
      formatMessage({
        username: botName,
        text: `${username} joined the chat.`,
      })
    );

    // Emit room update event to all users
    io.emit('roomUpdate', users);
  });

  // Receive new chat message event from client
  socket.on('chatMessage', (message) => {
    // Emit message to all users
    io.emit(
      'message',
      formatMessage({
        username: 'User',
        text: message,
      })
    );
  });

  // Receive disconnection event from client
  socket.on('disconnect', () => {
    // Emit disconnect message to all users
    io.emit(
      'message',
      formatMessage({
        username: botName,
        text: 'User left the chat.',
      })
    );

    // Emit room update event to all users
    io.emit('roomUpdate', users);
  });
});

// Generate port number to run server on
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
