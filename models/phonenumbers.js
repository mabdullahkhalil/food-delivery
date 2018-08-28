var mongoose = require("mongoose");

var PhonenumberSchema = new mongoose.Schema({
	numberr: {
		type: String,
		required: true,
		unique: true
	},
	verificationCode: {
		type: Number
	},
	isVerified: {
		type: Boolean,
		default: false
	}
});


PhonenumberSchema.pre('save', function(next){
  var phone = this;
  phone.verificationCode = Math.floor(Math.random() * 99999) + 100000;
  next()
});


module.exports = mongoose.model('Phonenumber', PhonenumberSchema);
