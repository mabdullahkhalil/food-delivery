var jwt= require('jsonwebtoken');
var mongoose= require('mongoose')
var db= require("../models/index");

exports.ensureCorrectUserRole= async(req,res,next) => {
	try {
		let userid = await jwtdecode(req.headers.token)
		let user = await db.User.findOne({"_id": mongoose.Types.ObjectId(userid)})
		if (user.userRole === "admin" || user.userRole === "customer") {
			next();
		} else {
			res.status(401).json({message: 'You are not authorized for this task'})
		}
	} catch( err){
			res.status(401).json({message: "err.errmsg"})
	}
}


async function jwtdecode(token){
  let err,decoded = jwt.verify(token,process.env.SECRET_KEY);
  if (err) {
    console.log(err)
    return err
  } 
  return decoded.userId
}


module.exports = exports