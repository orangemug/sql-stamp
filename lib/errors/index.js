var SQLError = require("./sql-errors");

module.exports = {
  SQLError:       SQLError,
  TooFewArgs:     SQLError.bind(null, "Too few args"),
  MissingKey:     SQLError.bind(null, "Missing key"),
  TooManyArgs:    SQLError.bind(null, "Too many args"),
  NoSuchTemplate: SQLError.bind(null, "No such template"),
};
