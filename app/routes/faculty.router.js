const express = require("express");
const router = express.Router();
const GatePass = require("../models/gatepass.model");
const Faculty = require("../models/faculty.model");
const { facultyAuth } = require("../functions/jwt");
const Student = require("../models/student.model");

router.get("/gatepass", facultyAuth, async (req, res) => {
  try {
    const { email } = req.user;
    const faculty = await Faculty.findOne({ email, isHOD: true });
    if (!faculty) {
      return res.json({ msg: "error", success: false });
    }
    const department = faculty.department;
    const results = await GatePass.find({ department: department });
    return res.json({ success: true, data: results.reverse() });
  } catch (err) {
    return res.json({ msg: "Error", success: false });
  }
});

router.get("/gatepass/:_id/:action", facultyAuth, async (req, res) => {
  let { email } = req.user;
  const hod = await Faculty.findOne({ email, isHOD: true });
  if (!hod) {
    return res.json({ success: false, msg: "Error" });
  }
  const _id = req.params._id;
  const gatepass = await GatePass.findOne({ _id, department: hod.department });
  if (!gatepass) {
    return res.json({ success: false, msg: "Error" });
  }
  const action = Number(req.params.action);
  gatepass.status = action;
  await gatepass.save();
  const msg = action === 1 ? "Gatepass approved" : "Gatepass rejected";
  return res.json({ msg, success: true });
});

router.get("/gatepass/:_id", facultyAuth, async (req, res) => {
  let { email } = req.user;

  const hod = await Faculty.findOne({ email, isHOD: true });
  if (!hod) {
    return res.json({ success: false, msg: "Error" });
  }
  const _id = req.params._id;
  const gatepass = await GatePass.findOne({ _id, department: hod.department });
  if (!gatepass) {
    return res.json({ success: false, msg: "Error" });
  }
  const student = await Student.findOne({ email: gatepass.requestBy });
  const data = {
    name: student.name,
    email: student.email,
    photo: student.photo,
    onTime: gatepass.onTime,
    onDate: gatepass.onDate,
    description: gatepass.description,
    _id: gatepass._id
  };
  return res.json({ success: true, data });
});

module.exports = router;
