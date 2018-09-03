'use strict';
var mongoose = require("mongoose")
var db = require("../models/index");



exports.createMeal= (req,res) => {
	console.log(req)
	db.Meal.create({
		name: req.body.name,
		location: req.body.location,
		days: req.body.days,
		mealImageUrl: req.body.mealImageUrl,
		price: req.body.price,
		options: req.body.options
	}).then(meal => {
		if (req.body.options) {
			// meal.options.push(req.body.options);

			// req.body.options.forEach(option => {
			// 	meal.options.push(option);
			// })
			// meal.save( err => {
			// 	if (err){
			// 		res.status(400).json({message: "Meal not added"});
			// 		return;
			// 	} 
			// });
		}
		res.status(200).json({message: "Meal added successfully"});
		return;

	}).catch(err => {
		console.log(err)
		res.status(400).json({message: "Meal not added"})

	});
}




module.exports = exports