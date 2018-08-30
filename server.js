require("dotenv").config()
var express = require("express");
var app = express();
var cors = require('cors');
var bodyParser = require("body-parser");
var passport = require("passport")
var FacebookTokenStrategy = require('passport-facebook-token');
var User = require("./models/users")
var http = require("http");

setInterval(function() {
    http.get("http://backend-foodddelivery.herokuapp.com");
}, 300000);


passport.use(new FacebookTokenStrategy({
	clientID: '515902558881080',
	clientSecret: '9cf7a42a9fb07e849c29f503f76a6c40'
}, function (accessToken, refreshToken, profile, done) {
	// let user = {
	// 	'email': profile.emails[0].value,
	// 	'name': profile.name.givenName + ' ' + profile.name.familyName,
	// 	'id': profile.id,
	// 	'token': accessToken
	// };
	User.findOne({email: profile.emails[0].value} , (err, user) => {
		if (user) {
			if (user.facebook.id == undefined) {
				user.facebook.id = profile.id;
				user.facebook.token = accessToken;
				user.save()
			}
			return done(null, user);
		} else {
			let newUser = new User();
			newUser.facebook.id = profile.id;
			newUser.facebook.token = accessToken;
			newUser.email= profile.emails[0].value,
			newUser.username= profile.name.givenName + ' ' + profile.name.familyName 

			newUser.save(err => {
				if (err) {
					console.log(err);
					throw err;
				}

				return done(null, newUser);
			});

		}
	})
}));
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id); 
   // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

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
    res.status(200).json({user: req.user})
  }
);


// const PORT = 8081

app.listen(process.env.PORT || 5000, function(){
  console.log(`Server iis listening`);
});


