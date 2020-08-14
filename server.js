// Import express module
const express = require('express');

// Import path module
const path = require('path');

// Import http module
const http = require('http');

// Create express app
const app = express();

// Create server object
const server = http.createServer(app);

// Set front end root directory to the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Generate port number to run server on
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
