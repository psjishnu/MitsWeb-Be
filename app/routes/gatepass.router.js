const express = require("express");
const router = express.Router();
const GatePass = require("./../models/gatepass.model");
const Student = require("./../models/student.model");
const { auth } = require("./../functions/jwt");
const {
  validateDeletion,
  validateCreation,
  validateEdit,
} = require("./validation/gatepass.validation");
const moment = require("moment");

//get gate pass requests made by the user.
router.get("/", auth, async (req, res) => {
  const email = req.user.email;
  const requests = await GatePass.find({
    requestBy: email,
    $or: [{ status: 0 }, { status: 1 }],
  });
  res.json({ data: requests.reverse(), success: true });
});

router.get("/view/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const gatepass = await GatePass.findOne({ _id, status: 1 });
    if (!gatepass) {
      return res.json({ success: false, msg: "Error" });
    }
    const date = gatepass.time;
    if (
      !(
        new Date(date).toISOString() > new Date().toISOString() ||
        moment().format("MMM Do YY") === moment(date).format("MMM Do YY")
      )
    ) {
      return res.json({ success: false, msg: "Error" });
    }
    const { onTime, onDate, department } = gatepass;
    const student = await Student.findOne({ email: gatepass.requestBy });
    if (!student) {
      return res.json({ success: false, msg: "Error" });
    }
    const { name, email, photo } = student;
    const data = {
      name,
      email,
      photo,
      department,
      onTime,
      onDate,
    };
    return res.json({ success: true, data });
  } catch (err) {
    return res.json({ success: false, msg: "Error" });
  }
});

router.post("/cancel", auth, validateDeletion, async (req, res) => {
  try {
    const email = req.user.email;
    const requests = await GatePass.findOne({
      requestBy: email,
      _id: req.body.deleteId,
    });
    if (!requests) {
      return res.json({ success: false, msg: "invalid id" });
    }
    requests.status = -1;
    await requests.save();
    return res.json({ success: true, msg: "Gatepass cancelled" });
  } catch (err) {
    return res.json({ msg: "error", success: false });
  }
});

//create a gate pass request
router.post("/request", auth, validateCreation, async (req, res) => {
  try {
    const user = await Student.findOne({ email: req.user.email });
    const department = user["department"];
    const { onDate, onTime, description, time } = req.body;
    const gatePass = new GatePass({
      onDate,
      onTime,
      description,
      department,
      requestBy: req.user.email,
      time,
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

router.post("/edit", auth, validateEdit, async (req, res) => {
  try {
    const { email } = req.user;
    const { onDate, onTime, description, _id } = req.body;

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
