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
		res.status(200).json({message: "Meal added successfully"});
		return;

	}).catch(err => {
		console.log(err)
		res.status(400).json({message: "Meal not added"})

	});
}

exports.showMeal= async(req,res) => {
	console.log("checkcheck")
	try{
		var meals = await db.Meal.find({isDeleted: false})
			console.log("checkcheck11")

		res.status(200).json({meals: meals})
		console.log(res)
	} catch(err){
   		 res.status(400).json({message: err.errmsg})
	}




}


module.exports = exports