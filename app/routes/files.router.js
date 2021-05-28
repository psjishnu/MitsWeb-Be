const express = require("express");
const router = express.Router();
const Student = require("../models/student.model");
const { studentAuth } = require("../functions/jwt");
const { fileUploader } = require("../functions/fileupload");

router.post("/", studentAuth, async (req, res) => {
  try {
    const { email } = req.user;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.json({ msg: "Error", success: false });
    }

    const returnURL = async (link) => {
      if (!link) {
        return res.json({ msg: "Error", success: false });
      }
      student.photo = link;
      await student.save();
      return res.json({ success: true, msg: "Photo updated" });
    };
    fileUploader(req, res, returnURL);
  } catch (err) {
    console.log(
      `Couldn't get feedback categories with error: ${err.message}`.red
    );
    return res.json({ success: false, msg: err.message });
  }
});

module.exports = router;
