const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const http = require("http");
var parseUrl = require("body-parser");
var mysql = require("mysql");
const path = require("path");
const flash = require("connect-flash");
const app = express();
const MemoryStore = require("memorystore")(sessions);

let encodeUrl = parseUrl.urlencoded({ extended: false });
var con = mysql.createConnection({
  host: "sql7.freesqldatabase.com",
  user: "sql7610226", // my username
  password: "tbLLyIB25a", // my password
  database: "sql7610226",
});

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekey",
    saveUninitialized: true,
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({ checkPeriod: 86400000 }),

    resave: false,
  })
);
app.use(flash());
app.use(cookieParser());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const userName = req.flash("user");
  res.render("index.ejs", { userName });
});
app.use(express.static(path.join(__dirname, "views")));
app.use("/", express.static(__dirname));

app.post("/register", encodeUrl, (req, res) => {
  var con = mysql.createConnection({
    host: "sql7.freesqldatabase.com",
    user: "sql7610226", // my username
    password: "tbLLyIB25a", // my password
    database: "sql7610226",
  });
  //get data from html
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var userName = req.body.userName;
  var password = req.body.password;

  con.connect(function (err) {
    if (err) {
      console.log(err);
    }
    //check if user is registered
    con.query(
      `SELECT * FROM users WHERE username = '${userName}' AND password  = '${password}'`,
      function (err, result) {
        if (err) {
          console.log(err);
        }
        if (Object.keys(result).length > 0) {
          res.sendFile(__dirname + "/failReg.html");
        } else {
          //creating user page in userPage function
          function userPage() {
            // We create a session for the dashboard (user page) page and save the user data to this session:
            req.session.user = {
              firstname: firstName,
              lastname: lastName,
              username: userName,
              password: password,
            };

            res.send(
              `
              <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            />
                      <h3>Hi, ${req.session.user.firstname} ${req.session.user.lastname}</h3>
                      <a href="/">Log out</a>

              `
            );
          }
          // inserting new user data
          var sql = `INSERT INTO users (firstname, lastname, username, password) VALUES ('${firstName}', '${lastName}', '${userName}', '${password}')`;
          con.query(sql, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              // using userPage function for creating user page
              userPage();
            }
          });
        }
      }
    );
  });
});

app.get("/login.html", (req, res) => {
  res.sendFile(__dirname + "/login.html");
  const userName = req.flash("user");
  res.render("login.html", { userName });
});

app.post("/dashboard", encodeUrl, (req, res) => {
  var userName = req.body.userName;
  var password = req.body.password;

  con.connect(function (err) {
    if (err) {
      console.log(err);
    }
    con.query(
      `SELECT * FROM users WHERE username = '${userName}' AND password = '${password}'`,
      function (err, result) {
        if (err) {
          console.log(err);
        }

        function userPage() {
          // We create a session for the dashboard (user page) page and save the user data to this session:
          req.session.user = {
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            username: userName,
            password: password,
          };
          req.flash("user", req.body.userName);
          res.redirect("/");
        }

        if (Object.keys(result).length > 0) {
          userPage();
        } else {
          res.sendFile(__dirname + "/failLog.html");
        }
      }
    );
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
