'use strict';

module.exports = function applicationError(message, errorStatus ) {
  Error.captureStackTrace(this, this.constructor);
  
  this.messages = message;
  this.status = errorStatus;
};

require('util').inherits(module.exports, Error);

