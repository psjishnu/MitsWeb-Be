const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { auth } = require("../functions/jwt");
const User = require("../models/user.model");
const { validateUpdate } = require("./validation/user.validation");

router.get("/getUser", auth, async (req, res) => {
  const currentUser = await User.findOne({ _id: req.user._id });
  console.log(`User retrieved`, `${currentUser.email}`.blue.bold);
  res.json({ data: currentUser, success: true });
});
//api used for updating user
router.post("/updateuser", validateUpdate, auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

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
