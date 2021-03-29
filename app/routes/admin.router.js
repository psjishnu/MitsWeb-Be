const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const Faculty = require("../models/faculty.model");
const Student = require("../models/student.model");
const Office = require("../models/office.model");
const { adminAuth } = require("../functions/jwt");
const bcrypt = require("bcryptjs");
const {
  validateUpdation,
  validateDeletion,
  validateAddUser,
} = require("./validation/admin.validation");

router.post("/deleteuser", validateDeletion, adminAuth, async (req, res) => {
  const idUser = await User.findOne({ _id: req.body.deleteId });
  if (!idUser) {
    res.json({ success: false, msg: "invlid id" });
  } else {
    const result = await User.deleteOne({ _id: req.body.deleteId });
    res.json({ success: true, msg: "user deleted" });
  }
});

router.post("/updateuser", validateUpdation, adminAuth, async (req, res) => {
  console.log(req.body);
  let idUser = await User.findOne({ email: req.body.email });
  if (!idUser) {
    res.json({ success: false, msg: "invalid id" });
  } else {
    const { email } = req.body;
    if (idUser.type == "student") {
      await Student.findOne({ email }).then((resp) => {
        idUser = resp;
      });
    }
    if (idUser.type == "office") {
      await Office.findOne({ email }).then((resp) => {
        idUser = resp;
      });
    }
    if (idUser.type == "faculty") {
      await Faculty.findOne({ email }).then((resp) => {
        idUser = resp;
      });
    }
    if (idUser.type == "admin") {
      await Admin.findOne({ email }).then((resp) => {
        idUser = resp;
      });
    }

    idUser.name = req.body.name;
    idUser.active = req.body.active;
    idUser.mobile = req.body.mobile;
    idUser.isHOD = req.body.isHOD;
    const result = await idUser.save();
    res.json({ success: true, msg: result });
  }
});

//router to add user
router.post("/adduser", validateAddUser, adminAuth, async (req, res) => {
  var { email, type, password } = req.body;
  email = email.toLowerCase();
  //check if the user with that mail already created
  await User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res.json({
        error: "User with that email already exists!!",
        success: false,
      });
    }

    bcrypt
      .hash(password, 12)
      .then(async (hashedPassword) => {
        const user = new User({
          email,
          type,
        });
        if (type === "student") {
          const newStudent = new Student({
            email,
            password: hashedPassword,
          });
          await newStudent.save();
        }
        if (type == "admin") {
          const newAdmin = new Admin({
            email,
            password: hashedPassword,
          });
          await newAdmin.save();
        }
        if (type == "faculty") {
          const newFaculty = new Faculty({
            email,
            password: hashedPassword,
          });
          await newFaculty.save();
        }
        if (type == "office") {
          const newOffice = new Office({
            email,
            password: hashedPassword,
          });
          await newOffice.save();
        }
        user.save().then((user) => {
          res.json({
            success: true,
            message: "User created and stored successfully!!",
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get("/allfaculties", adminAuth, async (req, res) => {
  try {
    var retArr = [];

    await Faculty.find({}, (err, resp) => {
      for (let i = 0; i < resp.length; i++) {
        const {
          name,
          email,
          mobile,
          active,
          registered,
          isHOD,
          advicor,
        } = resp[i];
        retArr[i] = { name, email, mobile, active, registered, isHOD, advicor };
      }
      res.json({ data: retArr, success: true });
    });
  } catch (err) {
    res.json({ msg: err, success: false });
  }
});

router.get("/alladmins", adminAuth, async (req, res) => {
  try {
    let retArr = [];
    await Admin.find({}, (err, resp) => {
      var j = 0;

      for (let i = 0; i < resp.length; i++) {
        const { name, mobile, active, registered, email } = resp[i];
        if (req.user.email !== email && email !== "admin@mitsweb.com") {
          retArr[j++] = {
            name,
            mobile,
            email,
            active,
            registered,
          };
        }
      }
      res.json({ data: retArr, success: true });
    });
  } catch (err) {
    res.json({ success: false, msg: err });
  }
});

router.get("/allstudents", adminAuth, async (req, res) => {
  var retArr = [];
  const allUsers = Student.find({}, (err, resp) => {
    for (let i = 0; i < resp.length; i++) {
      const {
        name,
        _id,
        pic,
        mobile,
        address,
        bloodGroup,
        dob,
        email,
        parentDetails,
        active,
      } = resp[i];
      retArr[i] = {
        name,
        _id,
        pic,
        mobile,
        address,
        bloodGroup,
        dob,
        email,
        parentDetails,
        active,
      };
    }
    res.json({ success: true, data: retArr });
  });
});

module.exports = router;
