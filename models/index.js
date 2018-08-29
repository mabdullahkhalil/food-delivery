var mongoose = require("mongoose");
mongoose.set('debug', true);
mongoose.Promise = global.Promise;
console.log("showing",process.env.DATABASE_URII )
mongoose.connect(process.env.DATABASE_URII, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true
}, err => {
	if (err) throw err
	else console.log("connected")
});
// var MongoClient = require('mongodb').MongoClient;

// var uri = process.env.DATABASE_URI;
// MongoClient.connect(uri, function(err, client) {
//    const collection = client.db("test").collection("devices");
//    // perform actions on the collection object
//    client.close();
// });

module.exports.User = require("./users");
module.exports.Phonenumber = require("./phonenumbers");