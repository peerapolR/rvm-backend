const express = require("express");
const cors = require("cors");
const app = express();
// const corsOptions = {
//   // origin: [
//   //   "http",
//   // ],
//   origin: "*",
//   allowedHeaders: ["Content-Type", "Authorization"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
//   optionsSuccessStatus: 204,
//   maxAge: 3600,
//   exposedHeaders: [
//     "Access-Control-Allow-Origin",
//     "Access-Control-Allow-Credentials",
//     "Content-Disposition",
//     "X-Suggested-Filename",
//   ],
// };

app.use(cors());
const bodyParser = require("body-parser");
const urlencoded = bodyParser.urlencoded({ extended: true });
const jsonParser = bodyParser.json({ limit: "50mb" });

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const config = require("./config/index");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const formulasRouter = require("./routes/formulas");
const ingredientsRouter = require("./routes/ingredients");
const ordersRouter = require("./routes/orders");

const errorHandler = require("./middlewares/errorHandler");
const passportJWT = require("./middlewares/passportJWT");
const checkRole = require("./middlewares/checkRole");

app.use(jsonParser);
app.use(urlencoded);

TZ = "Asia/Bangkok";

mongoose.set("strictQuery", false);
mongoose.connect(config.MONGODB_URI);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/formulas", formulasRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/orders", ordersRouter);

// app.use("/patients", [passportJWT.isLogin], patientsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  return res.status(status).json({
    message: err.message,
  });
});

// Check is login
// app.use("/bloods", [passportJWT.isLogin], bloodsRouter);

// app.use(errorHandler);
module.exports = app;
