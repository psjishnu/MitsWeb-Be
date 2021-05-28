const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { auth } = require("../functions/jwt");
const User = require("../models/user.model");
const Faculty = require("../models/faculty.model");
const { validateUpdate } = require("./validation/user.validation");
const Stats = require("../models/stats.model");
const Student = require("../models/student.model");

//api to get the current user
router.get("/getUser", auth, async (req, res) => {
  try {
    const currentUser = await User.findOne({ email: req.user.email });
    let stats = { feedback: false, payment: false };
    if (currentUser.type === "student") {
      const Stat = await Stats.findOne({});
      if (Stat) {
        const { feedback, payment } = Stat;
        stats.feedback = feedback;
        stats.payment = payment;
      }
    }
    console.log(`User retrieved`, `${currentUser.email}`.blue.bold);
    res.json({ data: currentUser, success: true, stats });
  } catch (err) {
    console.log(`error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//api to get the logged in faculty
router.get("/faculty", auth, async (req, res) => {
  try {
    const currentFaculty = await Faculty.findOne({ email: req.user.email });
    if (!currentFaculty) {
      return res.json({ success: false, msg: "invalid email" });
    }
    console.log(`Faculty retrieved`, `${currentFaculty.email}`.blue.bold);
    delete currentFaculty.password;
    const { active, registered, isHOD, department, email, mobile, name } =
      currentFaculty;
    res.json({
      data: {
        active,
        registered,
        isHOD,
        department,
        email,
        mobile,
        name,
      },
      success: true,
    });
  } catch (err) {
    console.log(`error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//api used for updating user
router.post("/updateuser", validateUpdate, auth, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email });
    if (!user.type === "student") {
      return res.json({ success: false, msg: "Error" });
    }
    let student = await Student.findOne({ email });
    if (!student) {
      return res.json({ success: false, msg: "Student not found" });
    }
    console.log(student);
    const data = req.body;
    console.log(data);

    let Error = false;
    student.name = data.name;
    student.mobile = data.number;
    student.parentDetails = data.parentDetails;
    student.address = data.address;
    student.dob = data.dob;
    student.bloodGroup = data.bloodGroup;
    if (data.password !== "") {
      if (data.password !== data.confirm) {
        Error = true;
      } else {
        student.password = await bcrypt.hash(data.password, 12);
      }
    }
    if (!Error) {
      await student.save();
      return res.json({
        message: "User updated successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Error",
        success: false,
      });
    }
  } catch (e) {
    return res.json({
      success: false,
      message: "Something went wrong..! Registration failed.",
    });
  }
});
//get logged in student
router.get("/student", auth, async (req, res) => {
  const { email } = req.user;
  const student = await Student.findOne({ email }).select("-password");
  if (!student) {
    return res.json({ success: false, msg: "Error..!" });
  }
  return res.json({ data: student, success: true });
});
module.exports = router;
