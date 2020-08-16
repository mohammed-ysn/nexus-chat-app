// Get room name from DOM
const roomName = document.querySelector('#room-name');

// Get list of room members from DOM
const usersList = document.querySelector('#users');

// Get chat messages from DOM
const chatMessages = document.querySelector('#chat-messages');

// Get chat form from DOM
const chatForm = document.querySelector('#chat-form');

// Store username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Update room name
roomName.innerText = room;

// Create a web socket
const socket = io();

// Emit join event to server
socket.emit('join', username);

// Receive room update event from server
socket.on('roomUpdate', (users) => {
  // Clear current members
  usersList.innerHTML = '';

  // Iterate through every user
  users.forEach((user) => {
    // Add the username to the members list
    const member = document.createElement('li');
    member.innerText = user;
    usersList.appendChild(member);
  });
});

// Receive message event from server
socket.on('message', outputMessage);

// Add event listener to send button
chatForm.addEventListener('submit', (event) => {
  // Prevent page refresh after the button is clicked
  event.preventDefault();

  // Store text in the message bar
  const message = event.target.msg.value;

  // Emit new chat message event to server
  socket.emit('chatMessage', message);

  // Clear text in the message bar
  event.target.msg.value = '';
});

// Output new message to DOM
function outputMessage({ username, text, time }) {
  // Create a message box
  const messageBox = document.createElement('div');

  // Add message class to the message box
  messageBox.classList.add('message');

  // Create message child nodes
  messageBox.innerHTML = `
  <p class="meta">${username} <span>${time}</span></p>
  <p class="text">${text}</p>`;

  // Output the message to the chat
  chatMessages.appendChild(messageBox);
}
