'use strict';
var mongoose = require("mongoose")
var db = require("../models/index");
var jwt = require('jsonwebtoken');
var client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


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
      phoneDetails: phone,
      userRole: req.body.userRole
    }).then(async function(user){
      var token = await jwt.sign({ userId: user.id}, process.env.SECRET_KEY);
      var message = await sendMessage(req.body.phoneNumber, "[#]  your Verification code is: "+phone.verificationCode+"\n 6b6579746f6")
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

exports.facebook_signin = async (req,res) => {
      console.log("trying to authenticate facebook")
    var token = await jwt.sign({userId: req.user.id}, process.env.SECRET_KEY);
    if (req.user.phoneDetails) {
      let phone = await db.Phonenumber.findOne({_id: req.user.phoneDetails})
      res.status(200).json({authtoken: token, phoneDetails: phone.isVerified})
    } else {
      res.status(200).json({authtoken: token, phoneDetails: null})
    }
}

exports.facebook_phone_adding = async(req,res) => {
  var token = req.headers.token
  try {
    var userid = await jwtdecode(token)
    let phone = await db.Phonenumber.create({numberr: req.body.phoneNumber});
    let user =  await db.User.updateOne({ "_id": mongoose.Types.ObjectId(userid)}, { $set: {phoneDetails: phone} });
    res.status(200).json({message: "phone added"})
  } catch(err) {
    console.log(err)
    res.status(401).json({message: err.errmsg})
  }
}

exports.verify_phone = async(req,res) => {
  var token= req.headers.token
   try {
    var userid = await jwtdecode(token)
    let user = await db.User.findOne({"_id": mongoose.Types.ObjectId(userid)}).populate("phoneDetails")
    console.log(user)
    if (user.phoneDetails.verificationCode == req.body.verificationCode){
      user.phoneDetails.isVerified = true;
      user.phoneDetails.save( err => {
        if (err) throw err
        res.status(200).json({message: "phone registered successfully"})
      });

      console.log(user)
    }
  } catch(err) {
    console.log(err)
    res.status(401).json({message: err.errmsg})
  }
}


async function jwtdecode(token){
  let err,decoded = jwt.verify(token,process.env.SECRET_KEY);
  if (err) {
    console.log(err)
    return err
  } 
  return decoded.userId
}


async function sendMessage(send_to,message_text){
  try {
    let message = await client.messages.create({from: process.env.TWILIO_PHONE_NUMBER,to: send_to, body: message_text});
    return message
  } catch(err) {
    console.log("error",err)
    return err
  }

}


module.exports = exports



