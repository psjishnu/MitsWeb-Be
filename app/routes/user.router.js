const express = require("express");
const router = express.Router();
const { auth } = require("../functions/jwt");
const User = require("../models/user.model");
router.get("/getUser", auth, async (req, res) => {
  const currentUser = await User.findOne({ _id: req.user._id });
  res.json({ user: currentUser, success: true });
});

module.exports = router;
