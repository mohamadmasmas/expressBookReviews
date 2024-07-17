const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//returns boolean write code to check is the username is valid
const isValid = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

   // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let book = req.params.isbn
  let user = req.session.authorization.username
  let review =  req.query.review
  if(books[book]){
    // if(!books[book].reviews){
    //     reviews = []
    // }else{
    //     console.log(books[book].reviews)
    //     reviews = [...books[book].reviews];
    // }
    books[book].reviews[user] = review
    res.send(user+ " has posted a review on "+books[book].title+  " book ====> "+review)
  }else if (!books[book]){
    return res.status(400).json({ message: "Book not found!" });
  }else{
    return res.status(404).json({ message: "Error accured" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let book = req.params.isbn
    let user = req.session.authorization.username
    if(books[book]){
      // if(!books[book].reviews){
      //     reviews = []
      // }else{
      //     console.log(books[book].reviews)
      //     reviews = [...books[book].reviews];
      // }
 
      let reviews = Object.keys(books[book].reviews)
      console.log(reviews)
      let after = reviews.filter((rev) =>  {
        console.log(rev)
        return rev != user
    })
    //   books[book].reviews = after
    let newReviews ={}
        after.forEach((e) => {
            newReviews[e] = books[book].reviews[after]
        })
      books[book].reviews = newReviews
      res.send("Your Review has been deleted")
    }else if (!books[book]){
      return res.status(400).json({ message: "Book not found!" });
    }else{
      return res.status(404).json({ message: "Error accured" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
