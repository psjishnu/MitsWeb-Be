const express = require("express");
const router = express.Router();
const Faculty = require("../models/faculty.model");
const Student = require("../models/student.model");

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
