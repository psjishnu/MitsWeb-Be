const express = require("express");
const router = express.Router();
const LeaveApplication = require("./../models/leaveapplication.model");
const Student = require("./../models/student.model");
const { auth } = require("./../functions/jwt");
const {
  validateCreation,
  validateDeletion,
} = require("./validation/leaveapplication.validation");
const moment = require("moment");

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
    const {
      toDate,
      fromDate,
      description,
      type,
      fromTimestamp,
      toTimestamp,
    } = req.body;
    console.log(`Leave type:${type} \n Description:${description}`.green);
    const leaveApplication = new LeaveApplication({
      toDate,
      fromDate,
      description,
      department,
      requestBy: req.user.email,
      type,
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
    return res.json({ msg: "error", success: false });
  }
});

module.exports = router;
