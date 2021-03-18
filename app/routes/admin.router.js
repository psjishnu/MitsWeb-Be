const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { adminAuth } = require("../functions/jwt");

router.get("/allusers", adminAuth, async (req, res) => {
  var retArr = [];
  const allUsers = User.find({}, (err, resp) => {
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

      retArr[i] = {
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
    res.json({ success: true, data: retArr });
  });
});

router.post("updateuser", adminAuth, async (req, res) => {
  console.log(req.body);
});

module.exports = router;
