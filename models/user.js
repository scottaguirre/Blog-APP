let mongoose         = require("mongoose");
let mongoosePassport = require("passport-local-mongoose");
let Schema           = mongoose.Schema;


let UserSchema = new Schema({
	
    name:  String,
    lastname: String,
	username: String,
	email: String,
	pass: String,
	level: String,
	date: { type: Date, default: Date.now },

  });

UserSchema.plugin(mongoosePassport, { usernameField: 'email', passwordField : 'password' });

let User = mongoose.model('User', UserSchema);

module.exports.User        = User;
module.exports.UserSchema  = UserSchema;