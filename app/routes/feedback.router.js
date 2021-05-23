const express = require("express");
const router = express.Router();
const { adminAuth, studentAuth } = require("./../functions/jwt");
const FeedbackCategory = require("./../models/feedbackcategory.model");
const { isValidObjectId } = require("mongoose");
const Stats = require("../models/stats.model");
const {
  validateaddFeedbackType,
  validateupdateFeedbackType,
} = require("./validation/feedback.validation");
const FeedbackQuestions = require("./../models/feedbackquestions.model");
const Feedback = require("./../models/feedback.model");

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

/*
    The data send in body should be in this format
{
    "category":"60a768f3672aca30148f9846",
    "questions": [ { "question": "how are you?"}, { "question": "how are you dear"} ]
}
    No need to send uuid , just send in the above format
*/
router.post("/questions", adminAuth, async (req, res) => {
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
      `Couldn't save feedback category questions with error: ${err.message}`.red
    );
    return res.json({ success: false, msg: err.message });
  }
});

//to get all the feedback category questions
router.get("/questions/:_id", studentAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    if (!isValidObjectId(_id)) {
      return res.json({ success: false, msg: "Error" });
    }
    const questions = await FeedbackQuestions.find({
      category: _id,
    }).populate({
      path: "category",
    });
    if (!questions) {
      return res.json({ success: false, msg: "Error" });
    }
    res.json({ success: true, data: questions });
  } catch (err) {
    console.log(
      `Couldn't get feedback category questions with error: ${err.message}`.red
    );
    return res.json({ success: false, msg: err.message });
  }
});

/* 
----------------------------Store answer for feedback api's---------------------------------
*/

//to get the answer and store
router.post("/", studentAuth, async (req, res) => {
  try {
    const { questionSet, faculty, feedback } = req.body;
    const user = req.user.email;

    feedback_received = new Feedback({
      questionSet,
      faculty,
      feedback,
      user,
    });

    await feedback_received.save();
    res.json({ success: true, data: feedback_received });
  } catch (err) {
    console.log(`Couldn't save feedback with error: ${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

module.exports = router;
