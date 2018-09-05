var express = require("express");
var app = express();
var router = express.Router();

var mealManager = require('../controllers/meal');
var checkAuth = require('../middleware/authMiddleware');

router.post('/addMeal',checkAuth.ensureCorrectUserRole, mealManager.createMeal);
router.get('/showMeal',checkAuth.ensureCorrectUserRole, mealManager.showMeal);


module.exports = router;

