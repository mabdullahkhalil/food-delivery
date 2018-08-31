'use strict';
var mongoose = require("mongoose")
var db = require("../models/index");
var jwt = require('jsonwebtoken');


exports.signin = function(req,res){
  console.log("showing stuff")
  // console.log(req)
  db.User.findOne({email: req.body.email}).populate("phoneDetails").then(function(user){
    console.log("showing", user)
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
      res.status(200).json({message: 'your phone is not verified yet'})
    }
  }).catch(function(err){
    res.status(400).json({message: 'User doesnot exist'})
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
};

exports.facebook_signin = (req,res) => {
      console.log("trying to authenticate facebook")
    var token = jwt.sign({userId: req.user.id}, process.env.SECRET_KEY);
    res.status(200).json({user: req.user, authtoken: token})
}

exports.facebook_phone_adding = async(req,res,cb) => {
  var token = req.headers.token
  try {
    var userid = await jwtdecode(token)
    let phone = await db.Phonenumber.create({numberr: req.body.phoneNumber});
    let user =  await db.User.updateOne({ "_id": mongoose.Types.ObjectId(userid)}, { $set: {phoneDetails: phone} });
    res.status(200).json({message: "phone added"})
    return
  } catch(err) {
    console.log(err)
    res.status(401).json({message: err.errmsg})
  }
}


async function jwtdecode(token){
  let err,decoded = jwt.verify(token,process.env.SECRET_KEY);
  if (err) {
    return null
  } 
  return decoded.userId
}



module.exports = exports



