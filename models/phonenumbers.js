var mongoose = require("mongoose");

var phonenumberSchema = new mongoose.Schema({
	number:{
		type: String,
		required: true,
		unique: true
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	verificationCode: {
		type: Number
	}
});


phonenumberSchema.pre('save', function(next){
  var phone = this;
  phone.verificationCode = Math.floor(Math.random() * 999999) + 100000;
});


module.exports = mongoose.model('Phonenumber', phonenumberSchema);
