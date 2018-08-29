'use strict';
var db = require("../models/index");
var jwt = require('jsonwebtoken');


exports.signin = function(req,res){
  console.log(req.query)
  console.log(req.body)
  db.User.findOne({email: req.query.email}).then(function(user){
    user.comparePassword(req.query.password, function(err, isMatch){
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
  }).catch(function(err){
    res.status(400).json({message: 'Invalid Email/Password'})
  })
};

exports.signup = function(req, res, next){
  console.log("something happening?")
  db.Phonenumber.create({numberr: req.query.phoneNumber}).then((phone) => { 
        db.User.create({
      email: req.query.email,
      password: req.query.password,
      username: req.query.username,
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
  });



  // });

};


module.exports = exports



