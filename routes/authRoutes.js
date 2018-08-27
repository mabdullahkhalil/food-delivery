var express = require("express");
var router = express.Router();

var jwt = require('jsonwebtoken');
var authenticationHelper = require('../controllers/auth');

router.post('/signin', authenticationHelper.signin);
router.post('/signup', authenticationHelper.signup);

module.exports = router;
