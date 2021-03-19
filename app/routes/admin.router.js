const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const AuthorizedUser = require("./../models/Admin/AddUser.model");
const { adminAuth } = require("../functions/jwt");
const e = require("express");
const {
  validateUpdation,
  validateDeletion,
  validateAddUser,
} = require("./validation/admin.validation");

router.post("/deleteuser", validateDeletion, adminAuth, async (req, res) => {
  const idUser = await User.findOne({ _id: req.body.deleteId });
  if (!idUser) {
    res.json({ success: false, msg: "invlid id" });
  } else {
    const result = await User.deleteOne({ _id: req.body.deleteId });
    res.json({ success: true, msg: "user deleted" });
  }
});

router.post("/updateuser", validateUpdation, adminAuth, async (req, res) => {
  const idUser = await User.findOne({ _id: req.body.id });
  if (!idUser) {
    res.json({ success: false, msg: "invalid id" });
  } else {
    const userType = req.body.type;
    if (userType == "admin" || userType == "student" || userType == "teacher") {
      idUser.type = userType;
    }
    idUser.name = req.body.name;
    idUser.mobile = req.body.mobile;
    const result = await idUser.save();
    res.json({ success: true, msg: result });
  }
});

//router to add user
router.post("/adduser", validateAddUser, adminAuth, async (req, res) => {
  const { email, type } = req.body;
  if (!email || !type) {
    return res
      .status(422)
      .json({ error: "Please fill all fields", success: false });
  }

  //check if the user with that mail already created
  await AuthorizedUser.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res.json({
        error: "User with that email already exists!!",
        success: false,
      });
    }

    const user = new AuthorizedUser({
      email,
      type,
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
});

router.get("/allusers", adminAuth, async (req, res) => {
  var retArr = [];
  const allUsers = User.find({}, (err, resp) => {
    var j = 0;
    for (let i = 0; i < resp.length; i++) {
      const {
        name,
        _id,
        pic,
        type,
        mobile,
        address,
        bloodGroup,
        dob,
        email,
        parentDetails,
      } = resp[i];
      if (req.user._id !== String(_id) && email !== "admin@mitsweb.com") {
        retArr[j++] = {
          name,
          _id,
          pic,
          type,
          mobile,
          address,
          bloodGroup,
          dob,
          email,
          parentDetails,
        };
      }
    }
    res.json({ success: true, data: retArr });
  });
});

module.exports = router;
