const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios').default;
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

const getBooks = async () => {
    return new Promise((resolve, reject) => {
        try {
            resolve(books);
        } catch (error) {
            reject("Error fetching books");
        }
    });
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const booksList = await getBooks(); 
        res.status(200).json({ books: booksList }); 
    } catch (err) {
        res.status(500).json({ message: 'Error fetching books', error: err.toString() });
    }
});

const getBookByISBN = async (isbn) => {
    return new Promise((resolve, reject) => {
        try {
            const book = books[isbn]; 
            if (book) {
                resolve(book); 
            } else {
                reject("Book not found for the given ISBN"); 
            }
        } catch (error) {
            reject("Error fetching book details");
        }
    });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const bookDetails = await getBookByISBN(isbn);
        return res.status(200).json({ book: bookDetails }); 
    } catch (err) {
        return res.status(404).json({ message: err }); 
    }
 });

 const getBooksByAuthor = async (author) => {
    return new Promise((resolve, reject) => {
        try {
            const filteredBooks = Object.values(books).filter(book => book.author === author);
            if (filteredBooks.length > 0) {
                resolve(filteredBooks); 
            } else {
                reject("No books found for the given author"); 
            }
        } catch (error) {
            reject("Error fetching books by author"); 
        }
    });
};
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const booksByAuthor = await getBooksByAuthor(author);
        return res.status(200).json(booksByAuthor); 
    } catch (err) {
        return res.status(404).json({ message: err }); 
    }
});

const getBooksByTitle = async (title) => {
    return new Promise((resolve, reject) => {
        try {
            const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
            if (filteredBooks.length > 0) {
                resolve(filteredBooks); 
            } else {
                reject("No books found for the given title"); 
            }
        } catch (error) {
            reject("Error fetching books by title"); 
        }
    });
};

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const booksByTitle = await getBooksByTitle(title);
        return res.status(200).json(booksByTitle); 
    } catch (err) {
        return res.status(404).json({ message: err }); 
    }
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
