var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if(req.user && req.user.membership_status) {
    res.render('newMessage', { title: 'New message' });
  } else {
    res.redirect("/")
  }
});

module.exports = router;
