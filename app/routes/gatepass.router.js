const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const GatePass = require("./../models/gatepass.model");
const { auth } = require("./../functions/jwt");

//create a gate pass request
router.post("/request", auth, async (req, res) => {
  try {
    console.log(req.body);
    const { onDate, onTime, description } = req.body;
    if (!onDate || !onTime || !description) {
      return res.status(422).json({ error: "please fill all fields!!" });
    } else {
      console.log(`Reason:${description},Date:${onDate},Time:${onTime}`.green);
    }
    req.user.password = undefined;
    const gatePass = new GatePass({
      onDate,
      onTime,
      description,
      requestBy: req.user,
    });
    await gatePass.save();
    return res.json({
      message: "gate pass requested successfully",
      success: true,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: "Something went wrong..! Gate pass request failed.",
    });
  }
});

module.exports = router;
