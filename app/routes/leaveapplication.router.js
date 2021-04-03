const express = require("express");
const router = express.Router();
const LeaveApplication = require("./../models/leaveapplication.model");
const Student = require("./../models/student.model");
const { auth } = require("./../functions/jwt");
const {
  validateCreation,
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
    const { toDate, fromDate, description, type } = req.body;
    console.log(`Leave type:${type} \n Description:${description}`.green);
    const leaveApplication = new LeaveApplication({
      toDate,
      fromDate,
      description,
      department,
      requestBy: req.user.email,
      type,
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

module.exports = router;
