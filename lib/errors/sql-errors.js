var util = require('util');

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
