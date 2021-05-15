const express = require("express");
const router = express.Router();
const { adminAuth } = require("../functions/jwt");
const { auth } = require("../functions/jwt");
const PayType = require("../models/paytypes.model");
const { validatePayTypeCreation } = require("./validation/payment.validation");

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
module.exports = router;
