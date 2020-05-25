let Blog    = require("../models/blogs").Blog;
let Comment = require("../models/comments").Comment;
const { check, validationResult }  = require('express-validator/check');
let override      = require("method-override");



function show_all_posts(app){
	
	app.get("/", (req, res) => {
	
		Blog.find({}, (err, posts) =>{
		
			//console.log(posts);
		
			res.render("index", {posts});
				
		});	
		
		
	
	
	});
	
}


function show_individual_post(app){
	
	app.get("/show_individual_post/:id", (req, res) => {
	
		let id = 	req.params.id;
		Blog.findById(id).populate("comments").exec( (err, post) =>{
		
			
			if(err) console.log(err);
		
		
			res.render("show-article", {post});
		
		
		});
	
	});
	
}


function form_to_update_article(isLoggedIn, app){
	
	app.get("/form_to_update_article/:id", (req, res) => {
		
		
		let id = req.params.id;
		
		if(!req.user){
		   
			res.render('error_msg_to_update_article', {msg:"You need to login!", link:`/show_individual_post/${id}`});
			
		} else {
			
			Blog.findById(id).populate("comments").exec( (err, post) =>{
		
			
				if(err) return console.log(err);
				
				if(post.author == req.user.username){
				   
					res.render("form_to_update_article", {post});
				   
				}else {
					
					res.render('error_msg_to_update_article', {msg:"Only the author can update this article", link:`/show_individual_post/${id}`});
					
				}
				
		
				
		
			});
			
		}
		
		
	});
	
	

}


function update_article (override , app ){
		
		app.put("/update_article/:id", [
		
		check('title', 'Title cannot be empty').not().isEmpty().trim().escape(),
		check('desc', 'Content cannot be empty').not().isEmpty().trim().escape(),
		check('author', 'Cannot be empty').not().isEmpty().trim().escape(),
		check('url', 'Url cannot be empty').not().isEmpty().trim()
		
	],
			(req, res) => {
		
		let post_id = req.params.id;
		let post = req.body;	
			post._id = post_id;
			
		let errors = validationResult(req);	
		
		if (!errors.isEmpty()) {
							
			errors = errors.array();

			res.render("form_to_update_article", { errors, post});
		
		} else {
		
		Blog.findByIdAndUpdate(post_id, req.body, {new: true}, (err, updatedPost) => {
			
			if(err) return console.log(err);
			
			console.log(updatedPost);
			
			res.render("go_to_updated_article", { uptMsg: "Your article has been updated!", link: `/show_individual_post/${post_id}`});
			
		});
			
		}
		
		
	});
}


function form_to_create_post(isLoggedIn, app){
	
	app.get("/form_to_create_post", (req, res) => {
		
		
		if(!req.user){
			
			res.render('error_msg_to_update_article', {msg_signin:"You need to login or sign up if not a member yet", link:"/sign_in"});
			
		} else {
			
			let username = req.user.username;
			
			let post;
			
			res.render("form_to_create_post", { username, post });
			
			
		}
		
		
	});
}



function create_post(app){
	
	app.post("/create_post", [
		check('post[title]', 'Title cannot be empty').not().isEmpty().trim().escape(),
		check('post[url]', 'Url cannot be empty').not().isEmpty().trim(),
		check('post[desc]', 'Content cannot be empty').not().isEmpty().trim().escape()
		
		
	], (req, res) => {
		
		let post = req.body.post;
		
		console.log(post);
		
		let errors = validationResult(req);	
		
		if (!errors.isEmpty()) {
							
			errors = errors.array();
							
			console.log(errors[0].msg);
			
			res.render("form_to_create_post", { errors, post });
		
		} else {
			
			Blog.create(post, (err, newPost) =>{
			
				if(err) return console.log(err);
			
					console.log(newPost);
			
				res.render("new_post_success", {msg: "You have created a new article!", link:" /show_individual_post/" + newPost._id });
				
			});
			
			
		}
			
		
	});
	
}

function show_all_posts(app){
	
	app.get("/", (req, res) => {
	
		Blog.find({}, (err, posts) =>{
		
			//console.log(posts);
		
			res.render("index", {posts});
				
		});	
		
		
	
	
	});
	
}

module.exports.show_all_posts       = show_all_posts;
module.exports.show_individual_post = show_individual_post;
module.exports.create_post          = create_post;
module.exports.form_to_create_post  = form_to_create_post;
module.exports.form_to_update_article  = form_to_update_article;
module.exports.update_article       = update_article;

