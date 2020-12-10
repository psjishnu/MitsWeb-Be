require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Welcome to MITS Web"));
app.listen(PORT, () => console.log(`MITS Web backend running on port ${PORT}`));
