const express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  axios = require("axios"), 
  LocalStrategy = require("passport-local"),
  passportLocalMongoose =
    require("passport-local-mongoose")
const User = require("./model/User");
let app = express();

mongoose.connect("mongodb://localhost/27017");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
  secret: "hehe",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("login");
});

app.get("/secret", isLoggedIn, function (req, res) {
  res.render("secret");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/account", isLoggedIn, function (req, res) {
  res.render("account", { username: req.user.username });
});

app.post("/register", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  });

  res.render("register")
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", async function (req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = req.body.password === user.password;
      if (result) {
        res.render("secret");
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

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/styles')); 

app.get("/chatbot", function (req, res) {
  res.render("chatBot");
});

app.post('/chatbot', async (req, res) => {
  try {
    const userMessage = req.body.message; // Assuming the frontend sends a 'message' field

    // TODO: Send 'userMessage' to the Python chatbot for processing using Axios
    const chatbotResponse = await axios.post('http://localhost:3000/chatbot', { message: userMessage });
    
    // Assuming the chatbotResponse contains the text response from the chatbot
    const chatbotTextResponse = chatbotResponse.data.response;

    res.status(200).json({ response: chatbotTextResponse });
  } catch (error) {
    console.error('Error communicating with the chatbot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});