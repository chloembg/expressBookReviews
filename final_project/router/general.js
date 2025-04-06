const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    const same_username = users.filter((user) => user.username === username);
    if (username && password) {
        if (same_username.length > 0) {
            return res.status(404).json({message: "User already exists!"});
        }
        else {
            users.push({"username": username, "password": password})
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }
    }
    else {
        return res.status(404).json({message: "Unable to register user."});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json({book});
    }
    else {
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filtered_books = Object.values(books).filter((book) => book.author === author);
    return res.status(200).json(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filtered_books = Object.values(books).filter((book) => book.title === title);
    return res.status(200).json(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        const reviews = book.reviews;
        return res.status(200).json(reviews);
    } 
    else {
        return res.status(404).json({ message: "Review not found for the given ISBN" });
    }
});

module.exports.general = public_users;
