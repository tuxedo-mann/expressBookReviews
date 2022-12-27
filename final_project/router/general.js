const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    if (!username || !password) {
        return res.status(403).json({message: "Parameters incomplete"});
    }
    if (!doesExist(username)) {
        users[username] = password;
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const bookISBN = req.params.isbn;
  const book = books[bookISBN];
  return res.status(300).send(JSON.stringify(book));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const authorBooks = [];
  for (book in books) {
    if ( books[book].author === author ) {
        authorBooks.push(books[book]);
    }
  }
  if (authorBooks.length == 0) {
      return res.status(300).json({message: `No books with author ${author} found`});
  }
  return res.status(300).send(JSON.stringify(authorBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  if (!books[title]) {
      return res.status(300).json({message: `No book with title ${title} found...`});
  }
  return res.status(300).send(JSON.stringify(books[title]));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if ( !books[isbn]) {
    return res.status(300).json({message: `No book with isbn ${isbn} found...`});
  }
  if ( !books[isbn].reviews) {
      return res.status(300).json({message: `No reviews for ${title} found...`});
  }
  return res.status(300).send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
