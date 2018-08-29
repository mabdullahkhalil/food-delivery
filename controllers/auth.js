'use strict';
var db = require("../models/index");
var jwt = require('jsonwebtoken');


exports.signin = function(req,res){
  db.User.findOne({email: req.body.email}).then(function(user){
    if (user.phoneDetails.isVerified){
      user.comparePassword(req.body.password, function(err, isMatch){
        if(isMatch){
          var token = jwt.sign({userId: user.id}, process.env.SECRET_KEY);
          res.status(200).json({userId: user.id,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
            token
          });
        } else {
          res.status(400).json({message: 'Invalid Email/Password.'})
        }
      })
    }else{
      res.status(400).json({message: 'your phone is not verified yet'})
    }
  }).catch(function(err){
    res.status(400).json({message: 'Invalid Email/Password'})
  })
};

exports.signup = function(req, res, next){
  console.log("something happening?")
  db.Phonenumber.create({numberr: req.body.phoneNumber}).then((phone) => { 
        db.User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      phoneDetails: phone
    }).then(function(user){
      var token = jwt.sign({ userId: user.id}, process.env.SECRET_KEY);
      res.status(200).json({userId: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        token
      });
    }).catch(function(err) {
      res.status(400).json(err);
    });
  }).catch((err) => {
          res.status(400).json(err);
  });



  // });

};


module.exports = exports



