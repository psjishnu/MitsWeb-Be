const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const {
  validateRegistration,
  validateLogin,
} = require("./validation/auth.validation");
// const requireLogin = require('../middlewares/requireLogin');

router.get("/", (req, res) => {
  res.json({ msg: "Welcome to MITS Web User Authentication!!" });
});

//signup route
router.post("/signup", validateRegistration, (req, res) => {
  const { name, email, password, pic } = req.body;
  console.log("User sign in request:", name, email, password);
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please fill all fields" });
  }
  //check if the user with that mail already exists
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User with that email already exists!!" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          name,
          pic,
        });
        user
          .save()
          .then((user) => {
            res.json({
              message: "User created and stored successfully!!",
              token: "hello this is the test token",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//signin route
router.post("/signin", validateLogin, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email and password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password!!" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({message:"successfully signed in"})
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, pic },
          });
        } else {
          return res.status(422).json({ error: "Invalid email or password!!" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
