const express = require("express");
const router = express.Router();
const Subject = require("../models/subject.model");
const User = require("../models/user.model");
const Student = require("../models/student.model");
const ExamType = require("../models/examtype.model");
const Timetable = require("../models/timetable.model");
const CourseMaterial = require("../models/coursematerial.model");
const { isValidObjectId } = require("mongoose");
const { auth, facultyAuth, adminAuth } = require("./../functions/jwt");
const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});
const { UploadToGCP } = require("../functions/gcpupload");
const Event = require("../models/event.model");

/* 
----------------------------Exam Api's---------------------------------
*/

//get exam types
router.get("/examtype", async (req, res) => {
  try {
    const exams = await ExamType.find({});
    return res.json({ success: true, data: exams.reverse() });
  } catch (err) {
    console.log(`Couldn't get exam type with error: ${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

/* 
----------------------------Subject Api's---------------------------------
*/

//return subjects list
router.get("/subject", async (req, res) => {
  try {
    const subjects = await Subject.find();

    if (subjects && subjects.length > 0) {
      return res.json({ success: true, data: subjects.reverse() });
    } else {
      return res.json({
        success: false,
        msg: "No subjects information found!!",
      });
    }
  } catch (err) {
    console.log(`Failed to return subjects list with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//return department and semester wise subjects list
router.get("/subject/:department/:semester", async (req, res) => {
  try {
    const department = req.params.department;
    const semester = req.params.semester;
    const subjects = await Subject.find({
      department,
      semester,
    });

    if (subjects && subjects.length > 0) {
      return res.json({ success: true, data: subjects.reverse() });
    } else {
      return res.json({
        success: false,
        msg: "No subjects information found!!",
      });
    }
  } catch (err) {
    console.log(`Failed to return subjects list with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

router.get("/timetable/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res.json({ success: false, msg: "Invalid id..!" });
    }
    const timeTable = await Timetable.findOne({ _id });
    if (!timeTable) {
      return res.json({ success: false, msg: "Invalid id..!" });
    }
    return res.json({
      data: timeTable,
      success: true,
    });
  } catch (err) {
    console.log(`Failed to return timetable with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

/* 
----------------------------Course Material Distribution Api's---------------------------------
*/

// to share the course material
router.post(
  "/resources",
  auth,
  upload.array("resources", 12),
  async (req, res) => {
    try {
      const files = req.files;
      if (!(Array.isArray(files) && files.length)) {
        res.json({ success: false, msg: "No files were provided!!" });
        return;
      }

      let resourceURLS = [];
      const FOLDER_NAME = "Course_Materials";

      for (let file of files) {
        const imageUrl = await UploadToGCP(file, FOLDER_NAME);
        resourceURLS.push({ url: imageUrl });
      }

      const { department, semester, subject, type, topic, description } =
        req.body;
      const userEmail = req.user.email;

      const coursematerial = new CourseMaterial({
        department,
        semester,
        subject,
        type,
        resources: resourceURLS,
        topic,
        description,
        uploadBy: userEmail,
      });
      await coursematerial.save();
      return res.json({
        data: coursematerial,
        success: true,
      });
    } catch (err) {
      console.log(
        `Failed to save course resources with error:${err.message}`.red
      );
      return res.json({ success: false, msg: err.message });
    }
  }
);

//to get the course materials
router.get("/resources", auth, async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    let query = { uploadBy: email };
    if (user !== null) {
      const type = user.type.toLowerCase();
      if (type === "student") {
        const student = await Student.findOne({ email });
        const { department, currentYear } = student;
        query = {
          department,
          semester: { $in: [currentYear * 2, currentYear * 2 - 1] },
        };
      }
    }
    const resources = await CourseMaterial.find(query).populate({
      path: "subject",
      select: ["name", "code"],
    });
    res.json({ success: true, data: resources });
  } catch (err) {
    console.log(`Failed to get resources with error:${err.message}`.red);
    res.json({ success: false, msg: err.message });
  }
});

//to get the course materials for the students
router.get("/resources/student", auth, async (req, res) => {
  try {
    const email = req.user.email;
    const student = await Student.findOne({ email });
    const { department, currentYear } = student;

    const resources = await CourseMaterial.find({
      department,
      currentYear,
    }).populate({
      path: "subject",
      select: ["name", "code"],
    });
    res.json({ success: true, data: resources });
  } catch (err) {
    console.log(`Failed to get resources with error:${err.message}`.red);
    res.json({ success: false, msg: err.message });
  }
});

/* 
----------------------------Events Calendar Api's---------------------------------
*/

//to save the events
router.post("/event", auth, async (req, res) => {
  try {
    const { title, department, semester, start, end, allDay } = req.body;
    const uploadBy = req.user.email;
    const user = await User.findOne({ email: uploadBy }).select("type");

    if (
      user === null ||
      !["faculty", "admin"].includes(user.type.toLowerCase())
    ) {
      return res.json({
        success: false,
        msg: "You are not authorized to perform this action",
      });
    }

    const event = new Event({
      title,
      end,
      start,
      allDay,
      uploadBy,
      department,
      semester,
    });

    await event.save();
    console.log(`Event created with title: ${title}`.blue);
    res.json({ success: true, data: event });
  } catch (err) {
    console.log(`Error saving event: ${err.message}`.red);
    res.json({ success: false, msg: err.message });
  }
});

//to get the list of events
router.get("/event", auth, async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });

    if (user !== null) {
      const type = user.type.toLowerCase();
      if (type === "admin") {
        const events = await Event.find({});
        return res.json({ success: true, data: events });
      }

      if (type === "faculty") {
        const events = await Event.find({ uploadBy: email });
        return res.json({ success: true, data: events });
      }

      if (type === "student") {
        const student = await Student.findOne({ email });
        const { department, currentYear } = student;

        const events = await Event.find({
          department: { $in: ["all", department] },
          semester: { $in: [0, currentYear] },
        });

        return res.json({ success: true, data: events });
      }
    }

    res.json({ success: false, msg: "Failed to get events" });
  } catch (err) {
    console.log(`Failed to get the events with error: ${err.message}`.red);
    res.json({ success: false, msg: err.message });
  }
});

module.exports = router;
