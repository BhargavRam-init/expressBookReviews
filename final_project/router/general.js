const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .json({ message: "Both Username and Password fields are mandatory" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);   // Returns the list of books that are mentioned in booksdb.js
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params;
  if (!books[isbn]){
    return res.status(404).json({message: "Book not Found"});
  }
  return res.status(200).json(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author} = req.params;
  const BooksbyAuthor = Object.values(books).filter(
    (book) => book.author == author
  );
  if (BooksbyAuthor.length == 0){
    return res.status(404).json({message: "No books found by this author"});
  }
  return res.status(200).json(BooksbyAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  const BooksbyTitle = Object.values(books).filter(
    (book) => book.title == title
  );
  if (BooksbyTitle.length == 0) {
    return res.status(404).json({ message: "No books found by this title" });
  }
  return res.status(200).json(BooksbyTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
