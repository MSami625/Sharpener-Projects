exports.success=(req, res, next) => {
    res.send(
      "<h1>Form Submitted Successfully</h1><a href='/contact-us'>Go Back</a>"
    );
  }