const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;
  const saltRounds = 12;

  try {
    const isUser = await User.findOne({ where: { email: email } });

    if (isUser) {
      return res.status(400).json({ error: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      if (!hashedPassword) {
        return res.status(400).json({ error: "Error hashing password" });
      }

      const userCreated = await User.create({
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        password: hashedPassword,
      });

      if (userCreated) {
        return res.status(201).json({ message: "User created" });
      } else {
        return res.status(400).json({ error: "Error creating user" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ error: "User does not Exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { email: user.email, userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "Login successful", token: token });
    } else {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  }
};
