var util = require("util");


/**
 * Specific error for this library so we can tell it apart from other errors.
 * @class
 * @param {String} message   error message
 * @param {String} [key]     error key
 */
function ParseError(message, key) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);

  if(key) {
    message+=" '"+key+"'";
  }

  this.name = this.constructor.name;
  this.message = message;
}

util.inherits(SQLError, Error);

module.exports = {
  ParseError:       ParseError,
  TooFewArgs:     ParseError.bind(null, "Too few args"),
  MissingKey:     ParseError.bind(null, "Missing key"),
  TooManyArgs:    ParseError.bind(null, "Too many args"),
  NoSuchTemplate: ParseError.bind(null, "No such template"),
};
