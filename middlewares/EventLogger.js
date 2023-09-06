const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;
const { v4: uuid } = require("uuid");
const { format } = require("date-fns");

const logEvent = async (message) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t ${message}`;
  if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
    await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
  } else {
    fs.appendFile;
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", "erroLog.txt", logItem)
    );
  }
};

module.exports = logEvent;
