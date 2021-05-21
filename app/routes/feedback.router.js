const express = require("express");
const router = express.Router();
const { adminAuth } = require("./../functions/jwt");
const FeedbackCategory = require("./../models/feedbackcategory.model");

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

module.exports = router;
