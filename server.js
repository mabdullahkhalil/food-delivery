require("dotenv").config()
var express = require("express");
var app = express();
var cors = require('cors');
var bodyParser = require("body-parser");
var passport = require("passport")
var FacebookTokenStrategy = require('passport-facebook-token');



app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


passport.use(new FacebookTokenStrategy({
    clientID: "515902558881080",
    clientSecret: "9cf7a42a9fb07e849c29f503f76a6c40"
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({facebookId: profile.id}, function (error, user) {
      return done(error, user);
    });
  }
));

var routes = require('./routes/authRoutes'); //importing route
// routes(app);

app.use('/api/',routes)

app.post('/auth/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
  	console.log("trying to authenticate facebook")
  	console.log(req.user)
    // do something with req.user
    res.send(req.user? 200 : 401);
  }
);


// const PORT = 8081

app.listen(process.env.PORT || 5000, function(){
  console.log(`Server iis listening`);
});