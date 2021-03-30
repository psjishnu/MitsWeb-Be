const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const GatePass = require("./../models/gatepass.model");
const { auth } = require("./../functions/jwt");

//get gate pass requests made by the user.
router.get("/usergatepasses", auth, async (req, res) => {
  const email = req.user.email;
  const requests = await GatePass.find({ requestBy: email });
  res.json({ data: requests.reverse(), success: true });
});

//create a gate pass request
router.post("/request", auth, async (req, res) => {
  try {
    const { onDate, onTime, description, time } = req.body;
    if (!onDate || !onTime || !description) {
      return res.status(422).json({ error: "please fill all fields!!" });
    } else {
      console.log(`Reason:${description},Date:${onDate},Time:${onTime}`.green);
    }
    const gatePass = new GatePass({
      onDate,
      onTime,
      description,
      time,
      requestBy: req.user.email,
    });
    await gatePass.save();
    return res.json({
      message: "gate pass requested successfully",
      success: true,
    });
  } catch (e) {
    console.log(`Error:${e}`.red);
    return res.json({
      success: false,
      message: "Something went wrong..! Gate pass request failed.",
    });
  }
});

router.post("/edit", auth, async (req, res) => {
  try {
    const { email } = req.user;
    const { onDate, onTime, description, _id } = req.body;
    console.log(req.body);

    const result = await GatePass.findOne({ _id, requestBy: email });
    if (!result) {
      return res.json({ success: false, msg: "An error occurred" });
    } else {
      result.onDate = onDate;
      result.onTime = onTime;
      result.description = description;
      await result.save();
      return res.json({ success: true });
    }
  } catch (err) {
    return res.json({ success: false, msg: "error" });
  }
});
module.exports = router;
