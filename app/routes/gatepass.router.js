const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const GatePass = require("./../models/gatepass.model");
const { auth } = require("./../functions/jwt");

//get gate pass requests made by the user.
router.get("/usergatepasses", auth, async (req, res) => {
  const email = req.user.email;
  const requests = await GatePass.find({ requestBy: email });
  res.json({ data: requests, success: true });
});

//create a gate pass request
router.post("/request", auth, async (req, res) => {
  try {
    const { onDate, onTime, description } = req.body;
    if (!onDate || !onTime || !description) {
      return res.status(422).json({ error: "please fill all fields!!" });
    } else {
      console.log(`Reason:${description},Date:${onDate},Time:${onTime}`.green);
    }
    const gatePass = new GatePass({
      onDate,
      onTime,
      description,
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

module.exports = router;
