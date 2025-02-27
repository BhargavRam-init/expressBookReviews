const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some((user) => user.username == username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(
    (user) => user.username == username && user.password == password
  );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .json({ message: "Both Username and Password fields are mandatory" });
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, "fingerprint_customer", {
      expiresIn: "1h",
    });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login Successful", token: accessToken});
  } else {
    return res.status(401).json({ message: "Invalid Username or Password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
