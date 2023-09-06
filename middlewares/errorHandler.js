const logEvent = require("./EventLogger");

function errorHandler(err, req, res, next) {
  logEvent(`${err.stack} : ${err.message}`);
  console.log(err.stack, err.message);
  res.status(500).json(err.message);
  next();
}
module.exports = errorHandler;
