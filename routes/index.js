const express = require('express');
const router = express.Router();
const moment = require("moment")
const Filter = require('bad-words');
const Message = require("../models/messageDb.js");
const customFilter = new Filter({ placeHolder: '*'});
customFilter.removeWords("god");
const User = require("../models/modelUser.js")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs")
const bodyParser = require("body-parser")
const {check, validationResult} = require("express-validator");
const urlencodedParser = bodyParser.urlencoded({extended: false})

router.get('/', function(req, res, next) {  
  Message.find().sort({ createdAt: -1 }).then((result) => {
        res.render('index', { 
      title: 'Home' , 
      user: req.user,
      messages: result.map((message) => {
           return {
              title: customFilter.clean(message.title),
              author: customFilter.clean(message.author),
              messageText: customFilter.clean(message.messageText),
              date: moment(new Date(message.date)).format("YYYY-MM-DD"),
              id: message._id
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

router.get("/sign-up" , (req, res) => {
  if(req.user) {
    res.redirect("/")
  } else {
    res.render("sign-up-form", {
      title: "Sign up"
    });
  }
})

router.get("/log-in" , (req, res) => {
  if(req.user) {
    res.redirect("/")
  } else {
    res.render("log-in", {
      title: "Log in"
    });
  }
});

router.get("/delete/:id", (req, res) => {
  if(req.user && req.user.admin_status) {
    const id = req.params.id;
    Message.findByIdAndDelete(id)
    .then(() => res.redirect("/"))
    .catch((err) => res.send({err}))
  } else {
    res.redirect("/")
  }
})

passport.use(
  new LocalStrategy(async(username, password, done) => {
      try {
          const user = await User.findOne({username: username});
          if(!user) {
              return done(null, false, {message: "Incorrect username"});
          };
          bcrypt.compare(password, user.password, (err, res) => {
            if(res) {
              return done(null, user)
            } else {
              return done(null, false, { message: "Incorrect password"})
            }
          })
      }catch(err) {
          return done(err);
      };
  })
)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

router.post("/sign-up", urlencodedParser, [
  check("username", "Username must be more than 4 characters long")
  .exists()
  .isLength({min: 4, max: 16}),
  check("password", "Password must be more than 4 characters long ")
  .exists()
  .isLength({min: 8}),
  check("password-confirm")
  .exists()  
  .custom(async (confirmPassword, {req}) => {
    const password = req.body.password
    if(password !== confirmPassword){
      throw new Error('Passwords must be same')
    }
  }),
  check("first_name", "First name must be at least 3 characters long")
  .exists()
  .isLength({min: 3, max: 16}),
  check("last_name", "Last name must be at least 3 characters long")
  .exists()
  .isLength({min: 3, max: 16}),

  
] ,  async (req, res, next) => {  
  bcrypt.hash(req.body.password, 10 , async (err, hashedPassword) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    } else {
      // try {
      // const user = new User({
      //       username: req.body.username.toLowerCase().trim(),
      //       password: hashedPassword,
      //       name: {
      //         first: req.body.first_name.trim(),
      //         last: req.body.last_name.trim()
      //       },
      //       membership_status: false,
      //       admin_status: false
      //     });
      //     const result = await user.save();
      //     res.redirect("/log-in");
      // }  catch(err) {
      //   return next(err);
      // };
      res.send("We good")
    }
    
  })
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/404"
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err)
    }
    res.redirect("/")
  })
})

router.get("/club-join", (req, res) => {
  if(req.user && !req.user.membership_status) {
    res.render("clubJoin", {
      title: "Join the club"
    })
  } else {
    res.redirect("/")
  }
})



router.post("/club-join", (req, res) => {
  const des = req.body.passcode.trim().toLowerCase() == process.env.PASSCODE;
  const  id = req.user._id;
  if(des) {
    User.findByIdAndUpdate(id, {$set: {
      membership_status: true
    }})
    .then(() => res.redirect("/"))
  } else {
    res.render("msg", {
      title: "Oops",
      message: "Try another time!"
    })
  }  
})

router.get("/control-panel", (req, res) => {
  if(req.user && req.user.admin_status) {
      User.find().then((result) => {
        res.render("controlPanel", {
          title: "Control panel",
          users: result 
        })
      })
    } else {
      res.redirect("/")
    }
})

module.exports = router;
