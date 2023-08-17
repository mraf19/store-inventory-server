var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
let bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const ItemRoute = require("./app/Item/router");
const CustomerRoute = require("./app/Customer/router");
const SalesRoute = require("./app/Sales/router");

const jsonparser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
app.use(cors());
app.use(jsonparser);
app.use(urlencodedParser);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", ItemRoute);
app.use("/api", CustomerRoute);
app.use("/api", SalesRoute);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
