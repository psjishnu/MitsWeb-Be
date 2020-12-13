const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const AuthValidator = require("google-auth-library");

const {
  validateRegistration,
  validateLogin,
} = require("./validation/auth.validation");
// const requireLogin = require('../middlewares/requireLogin');

router.get("/", (req, res) => {
  res.json({ msg: "Welcome to MITS Web User Authentication!!", success: true });
});

//signup route
router.post("/signup", validateRegistration, async (req, res) => {
  const { name, email, password, confirm, number, type } = req.body;
  if (!email || !password || !name) {
    return res
      .status(422)
      .json({ error: "Please fill all fields", success: false });
  }
  if (password !== confirm) {
    return res.status(422).json({ error: "Password not same", success: false });
  }
  //check if the user with that mail already exists
  await User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.json({
          error: "User with that email already exists!!",
          success: false,
        });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          name,
          type,
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

router.post("/googlelogin", async (req, resp) => {
  const tokenVerifier = async (token) => {
    const verify = async () => {
      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
      const client = new AuthValidator.OAuth2Client(CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    };
    return verify().catch(console.error);
  };

  await tokenVerifier(req.body.googleToken).then(async (res) => {
    const user = await User.findOne({
      email: res.email,
    });
    if (user) {
      console.log("old");
      user.photo = res.picture;
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "24h",
      });
      const { _id, name, email, pic } = user;
      resp.json({
        token,
        success: true,
        user: { _id, name, pic, email },
      });
    } else {
      console.log("new");
      const userNew = new User({
        name: res.name,
        email: res.email,
        pic: res.picture,
        type: "student",
        password: await bcrypt.hash(
          (Math.random() * Math.random()).toString(),
          10
        ),
      });
      await userNew.save().then((newres) => {
        const token = jwt.sign({ _id: newres._id }, JWT_SECRET, {
          expiresIn: "24h",
        });
        const { _id, name, email, pic } = newres;
        resp.json({
          token,
          success: true,
          user: { _id, name, pic, email },
        });
      });
    }
    // console.log(returnData);
  });

  //return resp.json({ msg: "ok" });
});

module.exports = router;
