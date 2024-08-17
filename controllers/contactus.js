const rootDir = require("../util/path");

exports.getContactus=(req, res, next) => {
    res.sendFile(rootDir+'/views/contact-us.html');
}

exports.PostContactus=(req, res, next) => {
    console.log(req.body);
    res.redirect("/success");
  }