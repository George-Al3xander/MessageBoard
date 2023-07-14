const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const logger = require('morgan');
const indexRouter = require('./routes/index');
const messageRouter = require('./routes/newMessage');
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");


const app = express();
const dbURI =  process.env.DB_URI;
const User = require("./models/modelUser.js")
mongoose.connect(dbURI , {useNewUrlParser: true, useUnifiedTopology: true}).then((result) => {app.listen(3000);console.log("connected to db")}).catch((err) => {
    console.log(err)
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/new', messageRouter);


app.use((req, res) => {
  res.render("404", {title: "404"})
})
module.exports = app;
