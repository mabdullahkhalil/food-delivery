require("dotenv").config()
var express = require("express");
var app = express();
var cors = require('cors');
var bodyParser = require("body-parser");
var passport = require("passport")
var http = require("http");
var routes = require('./routes/authRoutes');
var passport = require("passport")

setInterval(function() {
    http.get("http://backend-foodddelivery.herokuapp.com");
}, 300000);



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

passport.serializeUser(function(user, done) {
    done(null, user.id); 
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use(passport.initialize());

app.use('/api/',routes)

app.listen(process.env.PORT || 5000, function(){
  console.log(`Server iis listening`);
});


