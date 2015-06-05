var util = require('util');

/**
 * Specific error for this library so we can tell it apart from other errors.
 * @class
 * @param {String} message
 * @param {String} [key]
 */
function SQLError(message, key) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  if(key) {
    message+=" '"+key+"'";
  }

  this.name = this.constructor.name;
  this.message = message;
}

util.inherits(SQLError, Error);
module.exports = SQLError;
