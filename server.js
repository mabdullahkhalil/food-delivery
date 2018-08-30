require("dotenv").config()
var express = require("express");
var app = express();
var cors = require('cors');
var bodyParser = require("body-parser");
var passport = require("passport")
var FacebookTokenStrategy = require('passport-facebook-token');

passport.use(new FacebookTokenStrategy({

  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({facebookId: profile.id}, function (error, user) {
      return done(error, user);
    });
  }
));

passport.use(new FacebookTokenStrategy({
    clientID: '515902558881080',
    clientSecret: '9cf7a42a9fb07e849c29f503f76a6c40'
}, function (accessToken, refreshToken, profile, done) {
  let user = {
    'email': profile.emails[0].value,
    'name': profile.name.givenName + ' ' + profile.name.familyName,
    'id': profile.id,
    'token': accessToken
  };

  // You can perform any necessary actions with your user at this point,
  // e.g. internal verification against a users table,
  // creating new user entries, etc.

  return done(null, user); // the user object we just made gets passed to the route's controller as `req.user`

}));

app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));




var routes = require('./routes/authRoutes'); //importing route
// routes(app);

app.use('/api/',routes)

app.get('/auth/facebook/token',
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