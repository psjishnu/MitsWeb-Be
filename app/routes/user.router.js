const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { auth } = require("../functions/jwt");
const User = require("../models/user.model");
const Faculty = require("../models/faculty.model");
const { validateUpdate } = require("./validation/user.validation");
const Stats = require("../models/stats.model");

//api to get the current user
router.get("/getUser", auth, async (req, res) => {
  try {
    const currentUser = await User.findOne({ email: req.user.email });
    let stats = { feedback: false, payment: false };
    if (currentUser.type === "student") {
      const Stat = await Stats.findOne({});
      if (Stat) {
        const { feedback, payment } = Stat;
        stats.feedback = feedback;
        stats.payment = payment;
      }
    }
    console.log(`User retrieved`, `${currentUser.email}`.blue.bold);
    res.json({ data: currentUser, success: true, stats });
  } catch (err) {
    console.log(`error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//api to get the logged in faculty
router.get("/faculty", auth, async (req, res) => {
  try {
    const currentFaculty = await Faculty.findOne({ email: req.user.email });
    if (!currentFaculty) {
      return res.json({ success: false, msg: "invalid email" });
    }
    console.log(`Faculty retrieved`, `${currentFaculty.email}`.blue.bold);
    delete currentFaculty.password;
    const {
      active,
      registered,
      isHOD,
      department,
      email,
      mobile,
      name,
    } = currentFaculty;
    res.json({
      data: {
        active,
        registered,
        isHOD,
        department,
        email,
        mobile,
        name,
      },
      success: true,
    });
  } catch (err) {
    console.log(`error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//api used for updating user
router.post("/updateuser", validateUpdate, auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    const data = req.body;

    let Error = false;
    if (user) {
      user.name = data.name;
      user.mobile = data.number;
      user.parentDetails = data.parentDetails;
      user.address = data.address;
      user.dob = data.dob;
      user.bloodGroup = data.bloodGroup;
      if (data.password !== "") {
        if (data.password !== data.confirm) {
          Error = true;
        } else {
          user.password = await bcrypt.hash(data.password, 12);
        }
      }
      if (!Error) {
        await user.save();
        return res.json({
          message: "User updated successfully",
          success: true,
        });
      } else {
        return res.json({
          message: "Error",
          success: false,
        });
      }
    }
  } catch (e) {
    return res.json({
      success: false,
      message: "Something went wrong..! Registration failed.",
    });
  }
});

module.exports = router;
