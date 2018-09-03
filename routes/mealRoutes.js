var express = require("express");
var app = express();
var router = express.Router();

var mealManager = require('../controllers/meal');

router.post('/addMeal', mealManager.createMeal);


module.exports = router;

