var express = require("express");
const sessions = require("express-session");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
const path = require("path");
var flash = require("connect-flash");

passportLocalMongoose = require("passport-local-mongoose");
const User = require("./model/User");
const { request } = require("http");
var app = express();
app.use(flash());
require("dotenv").config();
const connectionString = process.env.DB_STRING;
mongoose.connect(connectionString);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "views")));
app.use("/", express.static(__dirname));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  const userName = req.flash("user");
  res.render("index", { userName });
});

app.get("/login", function (req, res) {
  res.render("login");
});
// Showing register form
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      $or: [
        { userName: req.body.userName },
        { password: req.body.password },
        { firstName: req.body.firstName },
        { lastName: req.body.lastName },
      ],
    });
    if (existingUser) {
      res.sendFile(__dirname + "/views/failReg.html");
      return;
    }
    //if the user does not exist

    const user = await User.create({
      username: req.body.userName,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    return res.send(`
    
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    />
    <div>
    <h2>Welcome ${user.username}</h2>
  </div>
  <center>
    <div>
      <a href="/" >Home</a>
    </div>
  </center>`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

//Showing login form
app.get("/login", function (req, res) {
  res.render("login");
});

//Handling user login
app.post("/login", async function (req, res) {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.userName });
    if (user) {
      //check if password matches
      const result = req.body.password === user.password;
      if (result) {
        req.flash("user", req.body.userName);
        res.redirect("/");
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

//Handling user logout
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
