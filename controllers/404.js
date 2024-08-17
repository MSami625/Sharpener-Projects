
const rootDir = require("../util/path");

exports.error = (req, res, next) => {
  res.status(404).sendFile(rootDir+"/views"+"/404.html");
};
