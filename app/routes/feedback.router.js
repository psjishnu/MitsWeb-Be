const express = require("express");
const router = express.Router();
const { adminAuth } = require("./../functions/jwt");
const FeedbackCategory = require("./../models/feedbackcategory.model");
const { isValidObjectId } = require("mongoose");
const {
  validateaddFeedbackType,
  validateupdateFeedbackType,
} = require("./validation/feedback.validation");

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
    res.json({ success: true, data: categories });
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
module.exports = router;
