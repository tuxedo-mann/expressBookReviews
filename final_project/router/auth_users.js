const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users[username] === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(users);
  if (!users[username]) {
      return res.status(403).json({message: `No user ${username} found`});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
      return res.status(300).json({message: `User ${username} successfully logged in...`});
  }
  else {
      return res.status(403).json({message: "Error logging in..."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const title = req.body.title;
    const review = req.body.review;
    const isbn = books[title].isbn

    books[isbn].reviews[req.session.username] = review
  return res.status(300).json({message: "Review Updated..."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
