// Version: 1.0
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.signUp = (req, res, next) => {
  const { name, email, password } = req.body;

  User.findOne({ where: { email } })
    .then((user) => {
      if (user) {
        res.status(400).json({ message: "User already exists" });
      } else {
        bcrypt.hash(password, 12, (err, hash) => {
          User.create({ name, email, password: hash }).then((user) => {
            res
              .status(201)
              .json({ message: "User created successfully", user });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong, Try Again with Credentials" });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }

      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Wrong Password" });
      }

      //found user
      const token = createJWT(user);
      res.status(200).json({ message: "User logged in successfully", token });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong, Try Again with Credentials" });
    });
};

function createJWT(user) {
  return jwt.sign(
    { userId: user.id, isPremiumUser: user.isPremiumUser },
    JWT_SECRET
  );
}
