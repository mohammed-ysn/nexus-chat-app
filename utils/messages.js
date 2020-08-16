// Import moment module for getting time
const moment = require('moment');

// Output appropriate message object
const formatMessage = ({ username, text, isSender }) => {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
    isSender,
  };
};

// Export formatMessage function
module.exports = formatMessage;
