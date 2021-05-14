const express = require("express");
const router = express.Router();
const Subject = require("../models/subject.model");
const ExamType = require("../models/examtype.model");
const Payment = require("../models/payment.model");
const Razorpay = require("razorpay");
const shortid = require("shortid");

const razorpay = new Razorpay({
  key_id: "rzp_test_6iKYRtRehIAgwt",
  key_secret: "P0WT57lYBt3MpsyYBPrwrQci",
});

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

/* 
----------------------------Payment Api's---------------------------------
*/

router.post("/verification", async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_SECRET;
    const crypto = require("crypto");
    const shasum = crypto.createHmac("sha256", secret);

    shasum.update(JSON.stringify(req.body));

    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      const payment = new Payment({
        payment: req.body,
      });

      await payment.save();
      return res.json({ success: true, status: "ok" });
    } else {
      return res.json({ success: false, status: "502" });
    }
  } catch (err) {
    console.log(`Failed with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

router.post("/razorpay", async (req, res) => {
  try {
    const payment_capture = 1;
    const amount = 500;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: shortid.generate(),
      payment_capture,
    };
    const response = await razorpay.orders.create(options);
    return res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.log(`Failed with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

module.exports = router;
