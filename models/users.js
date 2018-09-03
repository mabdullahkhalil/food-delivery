var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      // required: true
    },
    profileImageUrl: {
      type:String,
    },
    phoneDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phonenumber"
    },
   facebook: {
    id: {
      type:String,
      default: null
    },
    token: {
      type:String,
      default: null
    }
   },
   userRole: {
    type: String
   }
}, { timestamps: true });

userSchema.pre('save', function(next){
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10).then(function(hashedPassword) {
      user.password = hashedPassword
      next();
  }, function(err){
    return next(err)
  });
});


userSchema.pre('save', function(next) {
  let user= this;
  console.log(this)
  if (!this.userRole) {
    this.userRole = "customer"
    return next();
  } 
  if (this.userRole) {
    return next();
  }
});

userSchema.methods.comparePassword = function(candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return next(err);
    next(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
module.exports = User;