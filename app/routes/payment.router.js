const express = require("express");
const router = express.Router();
const { adminAuth } = require("../functions/jwt");
const { auth } = require("../functions/jwt");
const PayType = require("../models/paytypes.model");
const Payment = require("../models/payment.model");
const {
  validatePayTypeCreation,
  validateProcess,
} = require("./validation/payment.validation");
const Razorpay = require("razorpay");
const shortid = require("shortid");

const razorpay = new Razorpay({
  key_id: process.env.RAZPORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* 
----------------------------Create Payment Type Api's---------------------------------
*/

//to create payment type
router.post("/type", validatePayTypeCreation, adminAuth, async (req, res) => {
  try {
    const { type, amount, dueDate } = req.body;
    if (Number(amount) < 0) {
      return res.json({ success: false, msg: "Invalid amount entered!!" });
    }
    const payType = new PayType({
      type,
      amount,
      dueDate,
    });
    await payType.save();
    return res.json({ success: true, data: payType });
  } catch (err) {
    console.log(`Couldn't create pay type with error: ${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

//to get all payment types
router.get("/types", auth, async (req, res) => {
  try {
    const types = await PayType.find();
    return res.json({ success: true, data: types });
  } catch (err) {
    console.log(`Couldn't get pay types with error: ${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

// to process the payment
router.post("/razorpay", validateProcess, auth, async (req, res) => {
  try {
    const { paymentType, amount } = req.body;
    const { email } = req.user;
    const payment_capture = 1;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: shortid.generate(),
      payment_capture,
    };
    let response = await razorpay.orders.create(options);
    response = { ...response, paymentType, userEmail: email };
    return res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.log(`Failed with error:${err.message}`.red);
    return res.json({ success: false, msg: err.message });
  }
});

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

module.exports = router;
