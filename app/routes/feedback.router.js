const express = require("express");
const { object } = require("joi");
const router = express.Router();
const { adminAuth } = require("./../functions/jwt");
const FeedbackCategory = require("./../models/feedbackcategory.model");
const FeedbackQuestions = require("./../models/feedbackquestions.model");

/* 
----------------------------Create Feedback Category Api's---------------------------------
*/

//to create the category
router.post("/category", adminAuth, async (req, res) => {
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
});

//to get all the categories
router.get("/category", adminAuth, async (req, res) => {
  try {
    const categories = await FeedbackCategory.find();
    res.json({ success: true, data: categories });
  } catch (err) {
    console.log(
      `Couldn't get feedback categories with error: ${err.message}`.red
    );
    return res.json({ success: false, msg: err.message });
  }
});

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
router.post("/questions", async (req, res) => {
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
router.get("/questions", async (req, res) => {
  try {
    const questions = await FeedbackQuestions.find();
    console.log(questions);
    res.json({ success: true, data: questions });
  } catch (err) {
    console.log(
      `Couldn't get feedback category questions with error: ${err.message}`.red
    );
    return res.json({ success: false, msg: err.message });
  }
});

module.exports = router;
