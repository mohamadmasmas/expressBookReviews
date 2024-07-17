const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})
  myPromise.then(() => {
    res.send(books);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const book = req.params.isbn
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})
  myPromise.then(() => {
    if(books[book]){
      res.send(books[book])
      
    }else{
      return res.status(400).json({message: "Book doesn't exist"});
    }
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookKeys = Object.keys(books);
  let authorBooks = []
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})
  myPromise.then(() => {
    let selectedAuthor = bookKeys.map((key) => {
      if (books[key].author == author){
        authorBooks.push(books[key])
      }
    })
    if(selectedAuthor.length > 0){
      res.send(authorBooks)
    }else{
      return res.status(400).json({message: "Author doesn't exist"});
    }
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let bookKeys = Object.keys(books);
  let book = bookKeys.filter((key) => {
    return books[key].title == title
  })
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})
    myPromise.then(() => {
      if(book){
        res.send(books[book])
      }else{
        return res.status(400).json({message: "Book doesn't exist"});
      }
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const book = req.params.isbn
  if(books[book]){
    if(!books[book].review){
      res.send("There are no Reviews on " + books[book].title +" Book")
    }
    res.send("There is/are "+books[book].review + "Review/s on " + books[book].title +"Book")
  }else{
    return res.status(400).json({message: "Book doesn't exist"});
  }
});

module.exports.general = public_users;
