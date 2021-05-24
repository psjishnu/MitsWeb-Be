const express = require("express");
const router = express.Router();
const GatePass = require("../models/gatepass.model");
const Faculty = require("../models/faculty.model");
const { facultyAuth } = require("../functions/jwt");
const Student = require("../models/student.model");
const LeaveApplication = require("./../models/leaveapplication.model");
const Marks = require("./../models/marks.model");
const Subjects = require("../models/subject.model");
const Timetable = require("../models/timetable.model");
const Exam = require("../models/exam.model");
const Attendance = require("../models/attendance.model");
const moment = require("moment");
const { isValidObjectId } = require("mongoose");
const {
  validategetStudentsinClass,
  validateAddattendance,
  validateGetTimetable,
  validateGetAttendance,
} = require("./validation/faculty.validation");
const {
  validateExamCreation,
  validateGetSubjectExams,
  validateExamEdit,
} = require("./validation/exam.validation");

//api to get the gatepass requests for a particular faculty
router.get("/gatepass", facultyAuth, async (req, res) => {
  try {
    const { email } = req.user;
    const faculty = await Faculty.findOne({ email, isHOD: true });
    if (!faculty) {
      return res.json({ msg: "error", success: false, data: true });
    }
    const department = faculty.department;
    const results = await GatePass.find({
      department: department,
      status: 0,
    });

    var passes = [];
    results.filter((pass) => {
      if (
        new Date(pass.time).toISOString() > new Date().toISOString() ||
        moment().format("MMM Do YY") === moment(pass.time).format("MMM Do YY")
      ) {
        passes = passes.concat(pass);
      }
    });
    return res.json({ success: true, data: passes.reverse() });
  } catch (err) {
    return res.json({ msg: "Error", success: false });
  }
});

//to either update or reject a gatepass by faculty
router.get("/gatepass/:_id/:action", facultyAuth, async (req, res) => {
  try{
    let { email } = req.user;
  const _id = req.params._id;
  const action = Number(req.params.action);
  if (!(action === 1 || action === -1) || !isValidObjectId(_id)) {
    return res.json({ success: false, msg: "Invalid Id or Action" });
  }

  const hod = await Faculty.findOne({ email, isHOD: true });
  if (!hod) {
    return res.json({ success: false, msg: "Error" });
  }
  const gatepass = await GatePass.findOne({ _id, department: hod.department });
  if (!gatepass) {
    return res.json({ success: false, msg: "Error" });
  }

  gatepass.status = action;
  await gatepass.save();
  const msg = action === 1 ? "Gatepass approved" : "Gatepass rejected";
  return res.json({ msg, success: true });}
  catch (err) {
    console.log(`error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//get the gatepass by id
router.get("/gatepass/:_id", facultyAuth, async (req, res) => {
  try{
    let { email } = req.user;
  const _id = req.params._id;
  if (!isValidObjectId(_id)) {
    return res.json({ success: false, msg: "Invalid id" });
  }
  const hod = await Faculty.findOne({ email, isHOD: true });
  if (!hod) {
    return res.json({ success: false, msg: "Error" });
  }
  const gatepass = await GatePass.findOne({ _id, department: hod.department });
  if (!gatepass) {
    return res.json({ success: false, msg: "Error" });
  }
  const student = await Student.findOne({ email: gatepass.requestBy });
  const data = {
    name: student.name,
    email: student.email,
    photo: student.photo,
    time: gatepass.time,
    description: gatepass.description,
    _id: gatepass._id,
    status: gatepass.status,
  };
  return res.json({ success: true, data });}
  catch (err) {
    console.log(`error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//get all leaves
router.get("/leaves", facultyAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.json({ success: false, msg: "Error" });
    }
    var yearArray = [];
    const advisors = faculty.advisor;
    for (key in advisors) {
      if (advisors[key] === "true") {
        yearArray = yearArray.concat(Number(key[1]));
      }
    }
    var leaveApplications = await LeaveApplication.find({
      department: faculty.department,
      status: 0,
    });
    if (!leaveApplications) {
      leaveApplications = [];
    }
    var finalArr = [];
    for (var i = 0; i < leaveApplications.length; i++) {
      const email = leaveApplications[i].requestBy;
      const student = await Student.findOne({ email, currentYear: yearArray });
      if (student) {
        const data = {
          name: student.name,
          email: student.email,
          date: leaveApplications[i].date,
          description: leaveApplications[i].description,
          toDate: leaveApplications[i].toDate,
          type: leaveApplications[i].type,
          fromTime: leaveApplications[i].fromTime,
          toTime: leaveApplications[i].toTime,
          currentYear: student.currentYear,
          department: student.department,
          _id: leaveApplications[i]._id,
        };
        finalArr = finalArr.concat(data);
      }
    }
    return res.json({ success: false, data: finalArr.reverse() });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, msg: "Error" });
  }
});

router.get("/leaves/:_id/:action", facultyAuth, async (req, res) => {
  try {
    let { email } = req.user;
    const _id = req.params._id;
    const action = Number(req.params.action);
    if (!(action === 1 || action === -1) || !isValidObjectId(_id)) {
      return res.json({ success: false, msg: "Invalid Id or Action" });
    }
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.json({ success: false, msg: "Error" });
    }
    var yearArray = [];
    const advisors = faculty.advisor;
    for (key in advisors) {
      if (advisors[key] === "true") {
        yearArray = yearArray.concat(Number(key[1]));
      }
    }
    const leaveApplications = await LeaveApplication.findOne({
      _id,
      department: faculty.department,
      status: 0,
    });
    if (!leaveApplications) {
      return res.json({ success: false, msg: "Error" });
    }
    const student = await Student.findOne({
      email: leaveApplications.requestBy,
      currentYear: yearArray,
    });
    if (!student) {
      return res.json({ success: false, msg: "Error" });
    }
    leaveApplications.status = action;
    await leaveApplications.save();
    const msg = action === 1 ? "Gatepass approved" : "Gatepass rejected";
    return res.json({ success: true, msg });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, msg: "Error" });
  }
});

router.post(
  "/getstudents",
  validategetStudentsinClass,
  facultyAuth,
  async (req, res) => {
    try {
      const email = req.user.email;
      const { semester, department, day, subjectCode } = req.body;
      const dayList = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];

      if (!dayList.find((e) => e === day.toLowerCase())) {
        return res.json({ success: false, msg: "Invalid day" });
      }

      const table = await Timetable.findOne({
        semester,
        department,
      }).select("periodTimings");
      if (!table) {
        return res.json({ success: false, msg: "Timetable not found" });
      }
      const { periodTimings } = table;
      let timingsArr = [];
      for (let i = 0; i < periodTimings.length; i++) {
        if (periodTimings[i].day === day) {
          const { timings } = periodTimings[i];
          for (let j = 0; j < timings.length; j++) {
            if (timings[j].subject === subjectCode) {
              timingsArr = timingsArr.concat(timings[j]);
            }
          }
        }
      }
      const currentYear =
        semester === 1 || semester === 2
          ? 1
          : semester === 3 || semester === 4
          ? 2
          : semester === 5 || semester === 6
          ? 3
          : 4;
      let students = [];
      if (timingsArr.length > 0) {
        students = await Student.find({ department, currentYear });
      }
      return res.json({
        success: true,
        data: students,
        timings: timingsArr,
      });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, msg: "Error" });
    }
  }
);

/* 
----------------------------Marks Api's---------------------------------
*/

//to add a student's subject marks
router.post("/marks", facultyAuth, async (req, res) => {
  try {
    const { exam, markList } = req.body;
    const subjectMark = new Marks({
      exam,
      markList,
    });
    // await subjectMark.save();
    return res.json({
      success: true,
      msg: "Marks entered.",
      data: subjectMark,
    });
  } catch (err) {
    console.log(`Failed to enter marks with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//api to get marks (for test purpose)
router.get("/marks", async (req, res) => {
  try {
    const { examType, studentId } = req.body;
    const results = await Marks.find({ examType, studentId });
    return res.json({ success: true, data: results });
  } catch (err) {
    console.log(`Failed to get marks with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

/* 
----------------------------Subject Api's---------------------------------
*/

router.get("/myclasses", facultyAuth, async (req, res) => {
  try {
    const { email } = req.user;
    const faculty = await Faculty.findOne({ email }).select("-password");
    if (!faculty) {
      return res.json({ success: false, msg: "Error" });
    }
    const { department } = faculty;
    const subjects = await Subjects.find({ department });
    let finalArr = [];
    for (let i = 0; i < subjects.length; i++) {
      const teacher = subjects[i].taughtBy;
      if (String(teacher._id) === String(faculty._id)) {
        finalArr = finalArr.concat(subjects[i]);
      }
    }

    return res.json({ success: true, data: finalArr });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, msg: "Error" });
  }
});

/* 
----------------------------Attendance Api's---------------------------------
*/

router.post(
  "/attendance",
  validateAddattendance,
  facultyAuth,
  async (req, res) => {
    try {
      const {
        startTime,
        endTime,
        timeStamp,
        department,
        semester,
        period,
        attendanceList,
      } = req.body;
      const date = moment(timeStamp).format("MMM Do YY");

      const attendance = await Attendance.findOne({
        timeStamp: date,
        subjectCode: period,
        startTime,
        endTime,
        semester,
        department,
      });
      if (attendance) {
        return res.json({ success: false, msg: "Attendence already added!" });
      }

      const newAttendance = new Attendance({
        timeStamp: date,
        subjectCode: period,
        startTime,
        endTime,
        semester,
        department,
        attendanceList,
      });

      await newAttendance.save();

      return res.json({ success: true, msg: "Attendance added" });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, msg: "Error" });
    }
  }
);

router.post(
  "/getattendance",
  validateGetAttendance,
  facultyAuth,
  async (req, res) => {
    try {
      const { semester, department, subjectCode } = req.body;
      const attendance = await Attendance.find({
        semester,
        department,
        subjectCode,
      });
      return res.json({ success: true, data: attendance || [] });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, msg: "Error" });
    }
  }
);

/* 
----------------------------Exam Api's---------------------------------
*/

//to get list of students for a class
router.post("/findStudents", facultyAuth, async (req, res) => {
  try {
    let { department, semester } = req.body;
    department = department.toUpperCase();

    const currentYear =
      semester === 1 || semester === 2
        ? 1
        : semester === 3 || semester === 4
        ? 2
        : semester === 5 || semester === 6
        ? 3
        : 4;

    const students = await Student.find({
      department: department,
      currentYear,
    }).select("-password");

    return res.json({ success: true, data: students });
  } catch (err) {
    console.log(`Failed to get students list with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//to create an exam
router.post("/exam", validateExamCreation, facultyAuth, async (req, res) => {
  try {
    const {
      examType,
      subject,
      date,
      startTimestamp,
      endTimestamp,
      numberOfQuestions,
    } = req.body;
    const exam = new Exam({
      examType,
      subject,
      date,
      startTimestamp,
      endTimestamp,
      numberOfQuestions,
    });

    const result = await exam.save();
    return res.json({ success: true, data: result });
  } catch (err) {
    console.log(`Failed to create exam with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//to get list of exams
router.get("/exam", async (req, res) => {
  const query = [
    {
      path: "examType",
    },
    {
      path: "subject",
    },
  ];

  const result = await Exam.find().populate(query);
  return res.json({ success: true, data: result || [] });
});

//get list of exam details of subjects taught by faculty
router.post(
  "/exam/subjects/",
  validateGetSubjectExams,
  facultyAuth,
  async (req, res) => {
    try {
      let { department, semester } = req.body;
      const userEmail = req.user.email;

      const query = [
        {
          path: "examType",
        },
        {
          path: "subject",
        },
      ];
      semester = Number(semester[1]);
      department = department.toLowerCase();
      Exam.find()
        .populate(query)
        .exec((err, data) => {
          try {
            const result = data.filter((val) => {
              const filterData =
                val.subject &&
                val.subject.semester === semester &&
                val.subject.department &&
                val.subject.department.toLowerCase() === department &&
                val.subject.taughtBy.email === userEmail;
              return filterData;
            });
            return res.json({ success: true, data: result || [] });
          } catch (err) {
            console.log(
              `Failed to get subject exam details with error:${err.message}`.red
            );
            return res.json({
              success: false,
              msg: "Failed to get subject exams!!",
            });
          }
        });
    } catch (err) {
      console.log(
        `Failed to get subject exam details with error:${err.message}`.red
      );
      return res.json({ success: false, msg: err.message });
    }
  }
);

//to return exam based on types
router.get("/exam/:examType", facultyAuth, async (req, res) => {
  try {
    const { examType } = req.params;
    if (!isValidObjectId(examType)) {
      return res.json({ success: false, msg: "Invalid id" });
    }
    const exams = await Exam.find({ examType }).populate([
      {
        path: "subject",
      },
    ]);
    return res.json({ success: true, data: exams || [] });
  } catch (err) {
    console.log(`Failed to create exam with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

router.get("/exam/:_id/edit", facultyAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res.json({ success: false, msg: "Invalid id" });
    }

    const exam = await Exam.findOne({ _id }).select("-examType");
    if (!exam) {
      return res.json({ success: false, msg: "Invalid id" });
    }
    const { date, startTimestamp, endTimestamp, numberOfQuestions } = exam;
    return res.json({
      data: { _id, date, startTimestamp, endTimestamp, numberOfQuestions },
      success: true,
    });
  } catch (err) {
    return res.json({ success: false, msg: err.message });
  }
});

router.put("/exam", validateExamEdit, facultyAuth, async (req, res) => {
  try {
    const {
      _id,
      date,
      startTimestamp,
      endTimestamp,
      numberOfQuestions,
    } = req.body;
    if (!isValidObjectId(_id)) {
      return res.json({ success: false, msg: "Invalid Id" });
    }
    if (!(Number(numberOfQuestions) > 0)) {
      return res.json({ success: false, msg: "Cant be 0" });
    }
    const exam = await Exam.findOneAndUpdate(
      { _id },
      { date, startTimestamp, endTimestamp, numberOfQuestions },
      { returnOriginal: false }
    );
    if (!exam) {
      return res.json({
        success: false,
        msg: "Couldn't find the Exam and update it.",
      });
    }
    return res.json({ success: true, msg: "Exam Updated" });
  } catch (err) {
    console.log(`Couldn't update exam  with error: ${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

router.delete("/exam/:_id", facultyAuth, async (req, res) => {
  try {
    const _id = req.params._id;
    if (!isValidObjectId(_id)) {
      return res.json({ success: false, msg: "Invalid Id" });
    }

    const result = await Exam.deleteOne({ _id });
    if (!result) {
      return res.json({ success: false, msg: "Invalid Id" });
    }
    return res.json({ success: true, msg: "Exam Deleted" });
  } catch (err) {
    return res.json({ success: false, msg: "Error" });
  }
});

router.post(
  "/timetable",
  validateGetTimetable,
  facultyAuth,
  async (req, res) => {
    try {
      let { semester, department } = req.body;
      department = department.toUpperCase();
      const timetable = await Timetable.findOne({
        semester,
        department,
      }).select("periodTimings");
      if (!timetable) {
        return res.json({ success: false, msg: "Timetable not found" });
      }

      const { email } = req.user;
      const faculty = await Faculty.findOne({ email }).select("-password");
      if (!faculty) {
        return res.json({ success: false, msg: "Error" });
      }
      const Department = faculty.department;
      const subjects = await Subjects.find({
        department: Department,
        semester,
      });
      let finalArr = [];
      for (let i = 0; i < subjects.length; i++) {
        const teacher = subjects[i].taughtBy;
        if (String(teacher._id) === String(faculty._id)) {
          finalArr = finalArr.concat(subjects[i].code);
        }
      }

      return res.json({
        success: true,
        data: timetable.periodTimings || [],
        subjects: finalArr || [],
      });
    } catch (err) {
      console.log(
        `Failed to return timetable list with error:${err.message}`.red
      );
      return res.json({ success: false, msg: err.message });
    }
  }
);
module.exports = router;
