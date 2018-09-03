var mongoose = require("mongoose");

var mealSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true

	},
	options: [{
		name: {
			type: String
		},
		price: {
			type: Number
		}
	}],
	location: {
		type: String,
		required: true
	},
	days: [{ 
		type: String,
		required: true

	}],	
	mealImageUrl: {
		type: String,
		required: true

	},
	price: {
		type: Number,
		required: true
	}
});


var Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;