const express = require('express');
const router = express.Router();
const moment = require("moment")
var Filter = require('bad-words');
const Message = require("../models/messageDb.js");
var customFilter = new Filter({ placeHolder: '*'});
customFilter.removeWords("god")

router.get('/', function(req, res, next) {  
  Message.find().sort({ createdAt: -1 }).then((result) => {
    res.render('index', { 
      title: 'Home' , 
      messages: result.map((message) => {
           return {
              title: customFilter.clean(message.title),
              author: customFilter.clean(message.author),
              messageText: customFilter.clean(message.messageText),
              date: moment(new Date(message.date)).format("YYYY-MM-DD")
              }
      })});
  }).catch((err) => console.log(err));  
});

router.post("/new", (req, res) => {   
  const message =  new Message({...req.body, date: new Date()});
    message.save().then(() => {
        res.redirect("/")
    })  
})

module.exports = router;
