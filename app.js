const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const logger = require('morgan');
const indexRouter = require('./routes/index');
const messageRouter = require('./routes/newMessage');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const app = express();
const dbURI =  process.env.DB_URI;

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

app.use('/', indexRouter);
app.use('/new', messageRouter);

app.get("/sign-up" , (req, res) => {
  res.render("sign-up-form", {
    title: "Sign up"
  });
})

app.get("/login" , (req, res) => {
  res.render("login", {
    title: "Login"
  });
})
app.use((req, res) => {
  res.render("404", {title: "404"})
})
module.exports = app;
