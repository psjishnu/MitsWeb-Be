const express = require("express");
const router = express.Router();
const { adminAuth, studentAuth } = require("./../functions/jwt");
const FeedbackCategory = require("./../models/feedbackcategory.model");
const { isValidObjectId } = require("mongoose");
const Stats = require("../models/stats.model");
const {
  validateaddFeedbackType,
  validateupdateFeedbackType,
  validateGetquestions,
  validatepostFeedback,
  validatequestionFeedbackType,
} = require("./validation/feedback.validation");
const FeedbackQuestions = require("../models/feedbackquestions.model");
const Feedback = require("../models/feedback.model");
const Student = require("../models/student.model");

/* 
----------------------------Create Feedback Category Api's---------------------------------
*/

//to create the category
router.post(
  "/category",
  validateaddFeedbackType,
  adminAuth,
  async (req, res) => {
    try {
      const { category } = req.body;
      const feedbackCategory = new FeedbackCategory({
        category,
      });

      await feedbackCategory.save();
      res.json({ success: true, data: feedbackCategory });
    } catch (err) {
      console.log(
        `Couldn't create feedback category with error: ${err.message}`.red
      );
      return res.json({ success: false, msg: err.message });
    }
  }
);

//to get all the categories
router.get("/category", adminAuth, async (req, res) => {
  try {
    const categories = await FeedbackCategory.find();
    const stats = await Stats.findOne({});
    let status = false;
    if (stats) {
      status = stats.feedback;
    }
    res.json({ success: true, data: categories, status });
  } catch (err) {
    console.log(
      `Couldn't get feedback categories with error: ${err.message}`.red
    );
    return res.json({ success: false, msg: err.message });
  }
});

router.get("/category/student", studentAuth, async (req, res) => {
  try {
    const categories = await FeedbackCategory.find();
    const stats = await Stats.findOne({});
    let status = false;
    if (stats) {
      status = stats.feedback;
    }
    if (!status) {
      return res.json({ success: false, msg: "Error" });
    }
    return res.json({ success: true, data: categories });
  } catch (err) {
    console.log(
      `Couldn't get feedback categories with error: ${err.message}`.red
    );
    return res.json({ success: false, msg: err.message });
  }
});

router.put(
  "/category",
  validateupdateFeedbackType,
  adminAuth,
  async (req, res) => {
    try {
      const { _id, category } = req.body;
      if (!isValidObjectId(_id)) {
        return res.json({ success: false, msg: "invalid id" });
      }
      const result = await FeedbackCategory.findOneAndUpdate(
        { _id },
        { category },
        { returnOriginal: false }
      );
      if (!result) {
        return res.json({
          success: false,
          msg: "Couldn't find the Leave and update it.",
        });
      }
      return res.json({ success: true, msg: "Category Updated" });
    } catch (err) {
      console.log(
        `Couldn't update feedback categories with error: ${err.message}`.red
      );
      return res.json({ success: false, msg: err.message });
    }
  }
);

/* 
----------------------------Create Feedback Category Questions Api's---------------------------------
*/

//to create the questions
router.post(
  "/questions",
  validatequestionFeedbackType,
  adminAuth,
  async (req, res) => {
    try {
      const { category, questions } = req.body;
      const feedbackQuestions = new FeedbackQuestions({
        category,
        questions,
      });
      await feedbackQuestions.save();
      res.json({ success: true, data: feedbackQuestions });
    } catch (err) {
      console.log(
        `Couldn't save feedback category questions with error: ${err.message}`
          .red
      );
      return res.json({ success: false, msg: err.message });
    }
  }
);

//to get all the feedback category questions
router.post(
  "/questions/:_id",
  validateGetquestions,
  studentAuth,
  async (req, res) => {
    try {
      const { _id } = req.params;
      const { email } = req.user;
      const { faculty, code } = req.body;
      if (!isValidObjectId(_id)) {
        return res.json({ success: false, msg: "Error" });
      }
      const givenFeedback = await Feedback.findOne({
        user: email,
        questionSet: _id,
        faculty,
        code,
      });
      if (givenFeedback) {
        return res.json({
          success: true,
          questions: { questions: [] },
          msg: "You already responded to this survey",
        });
      }
      const questions = await FeedbackQuestions.findOne({
        category: _id,
      }).populate({
        path: "category",
      });
      if (!questions) {
        return res.json({ success: false, msg: "Error" });
      }
      res.json({ success: true, questions, msg: "" });
    } catch (err) {
      console.log(
        `Couldn't get feedback category questions with error: ${err.message}`
          .red
      );
      return res.json({ success: false, msg: err.message });
    }
  }
);

/* 
----------------------------Store answer for feedback api's---------------------------------
*/

//to get the answer and store
router.post("/", validatepostFeedback, studentAuth, async (req, res) => {
  try {
    const { questionSet, faculty, feedback, code } = req.body;
    if (!isValidObjectId(questionSet)) {
      return res.json({ msg: "invalid id", success: false });
    }
    const user = req.user.email;

    feedback_received = new Feedback({
      questionSet,
      faculty,
      feedback,
      user,
      code,
    });
    await feedback_received.save();
    res.json({ success: true, msg: "Feedback submitted" });
  } catch (err) {
    console.log(`Couldn't save feedback with error: ${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

router.get("/isvalid/:_id", adminAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res.json({ success: false, msg: "Invalid id" });
    }
    const valid = await FeedbackCategory.findOne({ _id }).select("category");
    if (!valid) {
      return res.json({ success: false, msg: "Invalid id" });
    }
    return res.json({ success: true, msg: "Valid id", data: valid });
  } catch (err) {
    return res.json({ success: false, msg: "Error" });
  }
});

router.post("/getfeedback/:id", adminAuth, async (req, res) => {
  try {
    const { currentYear, department } = req.body;
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.json({ success: false, msg: "Invalid id" });
    }
    const student = await Student.find({
      department: department.toUpperCase(),
      currentYear: Number(currentYear),
    }).select("email");
    if (!student) {
      return res.json({ msg: "No studentlist", success: false });
    }
    let emailArr = [];
    for (let i = 0; i < student.length; i++) {
      emailArr = emailArr.concat(student[i].email);
    }
    const feedbacks = await Feedback.find({
      questionSet: id,
      $or: [{ user: emailArr }],
    });
    const questionList = await FeedbackQuestions.findOne({
      category: id,
    }).select("questions");
    if (!feedbacks || !questionList) {
      return res.json({ msg: "No feedback", success: false });
    }
    var mapToquestion = {};
    const { questions } = questionList;
    for (let i = 0; i < questions.length; i++) {
      mapToquestion = {
        ...mapToquestion,
        [questions[i]._id]: questions[i].question,
      };
    }
    var feedbackOBJ = {};
    for (let i = 0; i < feedbacks.length; i++) {
      if (
        feedbackOBJ[feedbacks[i].faculty + "--" + feedbacks[i].code] ===
        undefined
      ) {
        feedbackOBJ = {
          ...feedbackOBJ,
          [feedbacks[i].faculty + "--" + feedbacks[i].code]:
            feedbacks[i].feedback,
        };
      } else {
        feedbackOBJ = {
          ...feedbackOBJ,
          [feedbacks[i].faculty + "--" + feedbacks[i].code]: feedbackOBJ[
            feedbacks[i].faculty + "--" + feedbacks[i].code
          ].concat(feedbacks[i].feedback),
        };
      }
    }
    const types = Object.keys(feedbackOBJ);
    // console.log(questionList);
    const processList = (list) => {
      let listObj = {};
      for (let i = 0; i < list.length; i++) {
        if (listObj[list[i].question] === undefined) {
          listObj = {
            ...listObj,
            [list[i].question]: [
              mapToquestion[list[i].question],
              list[i].answer,
            ],
          };
        } else {
          listObj = {
            ...listObj,
            [list[i].question]: listObj[list[i].question].concat(
              list[i].answer
            ),
          };
        }
      }
      return listObj;
    };
    let finalArr = [];
    for (let i = 0; i < types.length; i++) {
      const answerList = feedbackOBJ[types[i]];
      const result = processList(answerList);
      finalArr = finalArr.concat({ [types[i]]: result });
    }
    return res.json({ success: true, data: finalArr });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, msg: "Error" });
  }
});

router.delete("/:_id", adminAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res.json({ success: false, msg: "Error" });
    }
    const deleted = await FeedbackCategory.deleteOne({ _id });
    if (!deleted) {
      return res.json({ success: false, msg: "Error" });
    }
    await FeedbackQuestions.deleteMany({ category: _id });
    return res.json({ success: true, msg: "Deleted type!" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, msg: "Error" });
  }
});

module.exports = router;
