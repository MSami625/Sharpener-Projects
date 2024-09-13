const express = require("express");

const app = express();

app.use(express.json());

app.post("/api/user/signup", (req, res) => {
  console.log(req.body);
  res.send("User created");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
