// Get room name from DOM
const roomName = document.querySelector('#room-name');

// Get list of room members from DOM
const usersList = document.querySelector('#users');

// Get chat messages from DOM
const chatMessages = document.querySelector('#chat-messages');

// Get chat form from DOM
const chatForm = document.querySelector('#chat-form');

// Store username and room from URL
let { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Trim whitespace from start and end
username = username.trim();
room = room.trim();

// Set tab title to the room name
document.title = room;

// Create a web socket
const socket = io();

// Emit join room event to server
socket.emit('joinRoom', { username, room });

// Receive room update event from server
socket.on('roomUpdate', ({ room, users }) => {
  // Update room name on DOM
  updateRoomName(room);

  // Update list of room members on DOM
  updateRoomUsers(users);
});

// Receive message event from server
socket.on('message', (message) => {
  // Output new message to DOM
  outputMessage(message);

  // Scroll down to the new message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

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

  // Focus on the message bar so user can type
  event.target.msg.focus();
});

// Create message meta element
function createMeta(isSender, username, time) {
  // Create a paragraph element
  const metaElement = document.createElement('p');

  // Add meta class to the element
  metaElement.classList.add('meta');

  // Add the sender and the time
  metaElement.innerHTML = `${isSender ? 'You' : username} <span>${time}</span>`;

  return metaElement;
}

// Create message text element
function createText(text) {
  // Create a paragraph element
  const textElement = document.createElement('p');

  // Add text class to the element
  textElement.classList.add('text');

  // Add the text to the element
  textElement.innerText = text;

  return textElement;
}

// Output new message to DOM
function outputMessage({ username, text, time, isSender }) {
  // Create a container for the new message box
  const messageContainer = document.createElement('div');

  // Create a message box
  const messageBox = document.createElement('div');

  // Add class to the message container
  messageContainer.classList.add('message-container');

  // Add sender or recipient class to the message container
  messageContainer.classList.add(`${isSender ? 'sender' : 'recipient'}`);

  // Add message class to the message box
  messageBox.classList.add('message');

  // Add message sender and time to the message box
  messageBox.appendChild(createMeta(isSender, username, time));

  // Add message text to the message box
  messageBox.appendChild(createText(text));

  // Append the message box to the message container
  messageContainer.appendChild(messageBox);

  // Output the message to the chat
  chatMessages.appendChild(messageContainer);
}

// Update room name on DOM
function updateRoomName(room) {
  roomName.innerText = room;
}

// Update list of room members on DOM
function updateRoomUsers(users) {
  // Iterate through the users in the room and output a list item with their name
  usersList.innerHTML = `
    ${users
      .map((user) => {
        return `<li>${user.username}</li>`;
      })
      .join('')}`;
}
