const express = require("express");
const router = express.Router();
const { securityAuth } = require("../functions/jwt");
const GatePass = require("../models/gatepass.model");
const moment = require("moment");
const { validateGatepass } = require("./validation/security.validation");
const { isValidObjectId } = require("mongoose");

router.post("/verify", validateGatepass, securityAuth, async (req, res) => {
  const _id = req.body.gatepassId;
  if (!isValidObjectId(_id)) {
    return res.json({ success: false, msg: "Invalid Gatepass" });
  }
  const gatepass = await GatePass.findOne({ _id, status: 1 });
  if (!gatepass) {
    return res.json({ success: false, msg: "Invalid Gatepass" });
  }
  const date = gatepass.time;
  if (
    !(
      new Date(date).toISOString() > new Date().toISOString() ||
      moment().format("MMM Do YY") === moment(date).format("MMM Do YY")
    )
  ) {
    return res.json({ success: false, msg: "Invalid Gatepass" });
  }

  gatepass.status = 2;
  await gatepass.save();
  return res.json({ success: true, msg: "Valid Gatepass" });
});

module.exports = router;
