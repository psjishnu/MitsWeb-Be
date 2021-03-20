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
  validateGooglelogin,
} = require("./validation/auth.validation");
// const requireLogin = require('../middlewares/requireLogin');

router.get("/", (req, res) => {
  res.json({ msg: "Welcome to MITS Web User Authentication!!", success: true });
});

//signup route
router.post("/signup", validateRegistration, async (req, res) => {
  var { name, email, password, confirm, number, type, oldpassword } = req.body;

  if (password !== confirm) {
    return res.status(422).json({ error: "Password not same", success: false });
  }
  //check if the user with that mail already exists
  await User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser && savedUser.registered) {
        return res.json({
          msg: "Please login!!",
          success: false,
        });
      }
      if (savedUser && !savedUser.registered) {
        bcrypt
          .compare(oldpassword, savedUser.password)
          .then(async (doMatch) => {
            if (doMatch) {
              bcrypt.hash(password, 12).then(async (hashedPassword) => {
                savedUser.name = name;
                savedUser.mobile = number;
                savedUser.registered = true;
                savedUser.password = hashedPassword;
                await savedUser.save();
                return res.json({
                  msg: "User Registered",
                  success: true,
                });
              });
            } else {
              return res.json({
                msg: "wrong password",
                success: false,
              });
            }
          });
      }
      if (!savedUser) {
        if (email == "admin@mitsweb.com") {
          type = "admin";
          console.log(`${email}`.blue);
          if (oldpassword === process.env.ADMINPASSWORD) {
            bcrypt.hash(password, 12).then(async (hashedPassword) => {
              const newAdmin = new User({
                name,
                password: hashedPassword,
                type,
                mobile: number,
                email,
                registered: true,
              });
              await newAdmin.save();
              return res.json({
                msg: "User Registered",
                success: true,
              });
            });
          } else {
            return res.json({
              msg: "wrong sas",
              success: false,
            });
          }
        } else {
          return res.json({
            msg: "Invalid email",
            success: false,
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//signin route
router.post("/signin", validateLogin, async (req, res) => {
  const { email, password } = req.body;

  await User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.json({
        msg: "Invalid email or password!!",
        success: false,
      });
    }
    if (savedUser && !savedUser.registered) {
      return res.json({
        msg: "Please register!!",
        success: false,
      });
    }
    if (savedUser && !savedUser.active) {
      return res.json({
        msg: "Your account is diabled by admin!!",
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
          const { _id, name, email, photo } = savedUser;
          return res.header("mitsweb-access-token", token).json({
            token,
            success: true,
            user: { _id, name, photo },
          });
        } else {
          return res
            .status(422)
            .json({ success: false, msg: "Invalid email or password!!" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/googlelogin", validateGooglelogin, async (req, resp) => {
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
    if (user && user.active) {
      if (!user.registered) {
        console.log("new");
        user.registered = true;
        user.name = res.name;
      } else {
        console.log("old");
      }
      user.photo = res.picture;
      const userNow = await user.save();
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "24h",
      });
      const { _id, name, email, photo } = userNow;
      resp.json({
        token,
        success: true,
        user: { _id, name, photo, email },
      });
    } else {
      resp.json({
        success: false,
        msg: "Invalid User",
      });
    }
  });
});

module.exports = router;
