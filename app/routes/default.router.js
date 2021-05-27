const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("https://mitsweb.netlify.app/");
});

module.exports = router;
