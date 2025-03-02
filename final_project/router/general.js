const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBookByISBN = async (isbn) => {
  try {
    if (!books[isbn]) {
      throw new Error("Book not found");
    }
    return books[isbn];
  } catch (error) {
    throw new Error("Failed to fetch book details");
  }
};

public_users.post("/register", (req, res) => {
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

// Get the book list available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;

  try {
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const BooksbyAuthor = Object.values(books).filter(
    (book) => book.author == author
  );
  if (BooksbyAuthor.length == 0) {
    return res.status(404).json({ message: "No books found by this author" });
  }
  return res.status(200).json(BooksbyAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const BooksbyTitle = Object.values(books).filter(
    (book) => book.title == title
  );
  if (BooksbyTitle.length == 0) {
    return res.status(404).json({ message: "No books found by this title" });
  }
  return res.status(200).json(BooksbyTitle);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;