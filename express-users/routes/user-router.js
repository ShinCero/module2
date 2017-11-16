const express = require("express");
const bcrypt = require("bcrypt");

const UserModel = require("../models/user-model");

const router = express.Router();

// STEP #1 show the sign up form
router.get("/signup", (req, res, next) => {
  res.render("user-views/signup-page");
});

// STEP #2: process the sign up form
router.post("/process-signup", (req, res, next) => {
  if(req.body.signupPassword.length < 16 ||
     req.body.signupPassword.match(/[^a-z0-9]/i) === null             //                |
   ) { //               if no special characters
     res.locals.errorMessage = "Password is invalid";
     res.render("user-views/signup-page");

     // early return to stop the function since there's an error
     // (prevents the rest of the code from running)
     return;
   }
   // query the database to see if the email is taken
   UserModel.findOne({ email: req.body.signupEmail})
   .then((userFromDb) => {
     // userFromDb will be null if the email IS NOT taken

     // display the form again if the email is taken
     if(userFromDb !== null) {
       res.locals.errorMessage = "Email is taken";
       res.render("user-views/signup-page");
     }
     // generate a new salt for this user's password
     const salt = bcrypt.genSaltSync(10);
     // encrypt the password submitted from the form
     const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

     const theUser = new UserModel({
       fullName: req.body.signupFullName,
       email: req.body.signupEmail,
       encryptedPassword: scrambledPassword

     });

     // return the promise of the next database sign up
     return theUser.save();
   })

  .then(() => {
    // redirect to the home page on a successful sign up
    res.redirect("/");
  })
  .catch((err) => {
    next(err);
  });
}); // POST / process-signup


//STEP #1 show the log in form
router.get("/login", (req, res, next) => {
  res.render("user-views/login-page");
});

// STEP #2 process the log in form
router.post("/process-login", (req,res, next) => {
  
});


module.exports = router;
