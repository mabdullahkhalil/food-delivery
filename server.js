require("dotenv").config()
var express = require("express");
var app = express();
var cors = require('cors');
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var routes = require('./routes/authRoutes'); //importing route
// routes(app);

app.use('/api/',routes)


// const PORT = 8081

app.listen(process.env.PORT || 5000, function(){
  console.log(`Server iis listening`);
});