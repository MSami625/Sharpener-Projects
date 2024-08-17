const rootDir = require("../util/path");
const path = require("path");

exports.getAddProduct = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "product.html"));
};

exports.PostAddProduct = (req, res, next) => {
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  res.sendFile(rootDir + "/views/shop.html");
};
