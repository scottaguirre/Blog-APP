let mongoose = require("mongoose");

let UserSchema   = require("./user").UserSchema;

let Schema = mongoose.Schema;


let blogSchema = new Schema({
    title:  String,
    author: String,
	url: String,
	desc: String,
	date: {type: Date, default: Date.now},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
  });

let Blog = mongoose.model('Blog', blogSchema);

module.exports.Blog = Blog;
