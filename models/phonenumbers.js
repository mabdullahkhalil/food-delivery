var mongoose = require("mongoose");

var PhonenumberSchema = new mongoose.Schema({
	numberr: {
		type: String,
		required: true,
		unique: true,
		default: null
	},
	verificationCode: {
		type: Number,
		default: null
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
