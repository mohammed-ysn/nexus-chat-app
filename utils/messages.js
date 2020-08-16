// Import moment module for getting time
const moment = require('moment');

// Output appropriate message object
const formatMessage = ({ username, text }) => {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
  };
};

// Export formatMessage function
module.exports = formatMessage;
