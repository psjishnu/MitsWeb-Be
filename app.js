require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// connect to database
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//on successful connection
mongoose.connection.on("connected", () => {
  console.log("Connected to database!!");
});

//on error connecting to database
mongoose.connection.on("error", (err) => {
  console.log("error connecting to database " + err);
});

//allow cross origin requests
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");

//default code of expressjs generator

//to parse the incoming requests to json
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//import routes

const authRouter = require("./app/routes/auth.router");
const userRouter = require("./app/routes/user.router");

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//use the auth router
app.use("/auth", authRouter);

app.use("/user", userRouter);

//server listening on port
app.listen(PORT, () => console.log(`MITS Web backend running on port ${PORT}`));
