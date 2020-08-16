// Store all connected users
const users = [];

// Add user to connected users
const addUser = (id, username, room) => {
  users.push({ id, username, room });
};

// Remove user by id from connected users
const removeUser = (id) => {
  // Get list index of user
  const index = users.findIndex((user) => user.id === id);

  // If index was found, remove the user
  if (index !== -1) {
    // Return removed user
    return users.splice(index, 1)[0];
  }
};

// Get user by id
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// Get all users in a room
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

// Export the functions
module.exports = { addUser, removeUser, getUser, getUsersInRoom };
