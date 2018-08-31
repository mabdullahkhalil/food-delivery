var express = require("express");
var app = express();
var router = express.Router();
var passport = require("passport")
var FacebookTokenStrategy = require('passport-facebook-token');
var User = require("../models/users")


var jwt = require('jsonwebtoken');
var authenticationHelper = require('../controllers/auth');

passport.use(new FacebookTokenStrategy({
	clientID: '515902558881080',
	clientSecret: '9cf7a42a9fb07e849c29f503f76a6c40'
}, function (accessToken, refreshToken, profile, done) {
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


router.post('/signin', authenticationHelper.signin);
router.post('/signup', authenticationHelper.signup);
router.get('/auth/facebook/token', passport.authenticate('facebook-token'), authenticationHelper.facebook_signin)
router.post('/facebook_phone_adding', authenticationHelper.facebook_phone_adding)


module.exports = router;
