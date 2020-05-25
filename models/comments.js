let mongoose                       = require("mongoose");
let Schema                         = mongoose.Schema;

let CommentSchema = new Schema({
	
	username: String,
	text:     String,
	date:     { type: Date, default: Date.now }
	
  });


let Comment = mongoose.model('Comment', CommentSchema);

module.exports.Comment  = Comment;
