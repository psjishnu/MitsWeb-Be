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
  res.json({ msg: "Welcome to MITS Web User Authentication!!", success: true });
});

//signup route
router.post("/signup", validateRegistration, (req, res) => {
  const { name, email, password, confirm, number } = req.body;
  console.log("User sign in request:", name, email, password);
  if (!email || !password || !name) {
    return res
      .status(422)
      .json({ error: "Please fill all fields", success: false });
  }
  if (password !== confirm) {
    return res.status(422).json({ error: "Password not same", success: false });
  }
  //check if the user with that mail already exists
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({
          error: "User with that email already exists!!",
          success: false,
        });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          name,
          mobile: number,
        });
        user
          .save()
          .then((user) => {
            res.json({
              success: true,
              message: "User created and stored successfully!!",
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
router.post("/signin", validateLogin, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ success: false, error: "Please add email and password" });
  }
  await User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.json({
        error: "Invalid email or password!!",
        success: false,
      });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({message:"successfully signed in"})
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET, {
            expiresIn: "24h",
          });
          const { _id, name, email, pic } = savedUser;
          console.log("logged in");
          res.header("mitsweb-access-token", token).json({
            token,
            success: true,
            user: { _id, name, pic },
          });
        } else {
          return res
            .status(422)
            .json({ success: false, error: "Invalid email or password!!" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
