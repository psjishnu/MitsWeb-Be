require("dotenv").config();
const express = require("express");
const router = express.Router();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("colors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { mongoConnect } = require("./app/functions/db");

//allow cross origin requests
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");

//connect to mongoDB

mongoConnect();

//to parse the incoming requests to json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// response for get('/')

app.use(router);

//import routes
const adminRouter = require("./app/routes/admin.router");
const authRouter = require("./app/routes/auth.router");
const defaultRouter = require("./app/routes/default.router");
const facultyRouter = require("./app/routes/faculty.router");
const gatepassRouter = require("./app/routes/gatepass.router");
const leaveapplicationRouter = require("./app/routes/leaveapplication.router");
const paymentRouter = require("./app/routes/payment.router");
const securityRouter = require("./app/routes/security.router");
const sharedRouter = require("./app/routes/shared.router");
const studentRouter = require("./app/routes/student.router");
const userRouter = require("./app/routes/user.router");

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//use the  routes
app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/", defaultRouter);
app.use("/faculty", facultyRouter);
app.use("/gatepass", gatepassRouter);
app.use("/leaveapplication", leaveapplicationRouter);
app.use("/payment", paymentRouter);
app.use("/security", securityRouter);
app.use("/shared", sharedRouter);
app.use("/student", studentRouter);
app.use("/user", userRouter);

//server listening on port
app.listen(PORT, () => {
  console.clear();
  console.log(`MITS Web backend running on port ${PORT}`.yellow);
});
