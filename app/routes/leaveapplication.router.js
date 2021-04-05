const express = require("express");
const router = express.Router();
const LeaveApplication = require("./../models/leaveapplication.model");
const Student = require("./../models/student.model");
const { auth } = require("./../functions/jwt");
const {
  validateCreation,
  validateDeletion,
  validateEdit,
} = require("./validation/leaveapplication.validation");
const moment = require("moment");
const { isValidObjectId } = require("mongoose");

//get leave application submissions made by the user.
router.get("/", auth, async (req, res) => {
  const email = req.user.email;
  const requests = await LeaveApplication.find({
    requestBy: email,
    $or: [{ status: 0 }, { status: 1 }],
  });
  res.json({ data: requests.reverse(), success: true });
});

//create a new leave application request
router.post("/request", auth, validateCreation, async (req, res) => {
  try {
    const user = await Student.findOne({ email: req.user.email });
    const department = user["department"];
    const { description, fromTimestamp, toTimestamp } = req.body;
    const leaveApplication = new LeaveApplication({
      description,
      department,
      requestBy: req.user.email,
      fromTimestamp,
      toTimestamp,
    });
    await leaveApplication.save();
    return res.json({
      message: "leave application submitted successfully",
      success: true,
    });
  } catch (e) {
    console.log(`Error:${e}`.red);
    return res.json({
      success: false,
      message: "Something went wrong..! Leave application submission failed.",
    });
  }
});

//cancel a leave application submission
router.post("/cancel", auth, validateDeletion, async (req, res) => {
  try {
    const email = req.user.email;
    if (!isValidObjectId(req.body.deleteId)) {
      return res.json({ success: false, msg: "Invalid Id" });
    }
    const request = await LeaveApplication.findOne({
      requestBy: email,
      _id: req.body.deleteId,
    });
    if (!request) {
      return res.json({ success: false, msg: "invalid id" });
    }
    request.status = -1;
    await request.save();
    return res.json({ success: true, msg: "Leave submission cancelled" });
  } catch (err) {
    console.log(`{err.message}`.red);
    return res.json({ msg: err.message, success: false });
  }
});

//api end point to edit the leave application
router.post("/edit", auth, validateEdit, async (req, res) => {
  try {
    const { email } = req.user;
    const { description, _id, toTimestamp, fromTimestamp } = req.body;
    if (!isValidObjectId(_id)) {
      return res.json({ success: false, msg: "Invalid Id" });
    }
    const result = await LeaveApplication.findOne({ _id, requestBy: email });
    if (!result) {
      return res.json({ success: false, msg: "An error occurred" });
    } else {
      result.fromTimestamp = fromTimestamp;
      result.toTimestamp = toTimestamp;
      result.description = description;
      await result.save();
      return res.json({ success: true });
    }
  } catch (err) {
    console.log(`{err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

module.exports = router;
