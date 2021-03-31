const express = require("express");
const router = express.Router();
const GatePass = require("../models/gatepass.model");
const Faculty = require("../models/faculty.model");
const { facultyAuth } = require("../functions/jwt");

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

module.exports = router;
