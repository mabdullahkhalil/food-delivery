var mongoose = require("mongoose");
mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/foodapp', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true
}, err => {
	if (err) throw err
	else console.log("connected")
});

module.exports.User = require("./users");
module.exports.Phonenumber = require("./phonenumbers");