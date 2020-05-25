let Blog						   = require("../models/blogs").Blog;
let Comment						   = require("../models/comments").Comment;
const { check, validationResult }  = require('express-validator/check');

function adding_comments(app){
	
	app.post("/adding_comments", [
		check('comment', 'Cannot be empty').not().isEmpty().trim().escape()], 
			 
			 (req, res) =>{
		
			let post_id = req.body.post_id;
		
			let errors = validationResult(req);		
			
  				
			if(req.user ){

				if(req.user.level == "Contributor" || req.user.level == "Editor"){ 
					
					if (!errors.isEmpty()) {
							
						errors = errors.array();
				
						
						console.log(errors[0].msg);
		
				
						return res.json( {response: 0, msg: errors[0].msg });
			
					} else {
						
						let text = req.body.comment; 

						Comment.create({ text: text, username: req.user.username }, 

						(err, comment) => {

							if(err){ console.log(err); 

								res.json( { response: 0,  msg: "An error has ocurred" });

							} else {

								if(comment){
									

									Blog.findById( post_id, (err, blog) => {

										if(err) console.log(err);

										if(blog){

											blog.comments.push(comment);
											blog.save();
											
											res.json( { response: 1 });
										

										}
				

									});
									
	
								} else {

									res.json( { response: 0,  msg: "An error has ocurred" });

								}	
							}

						});
						
						
						
					}
		
				}

			
			}else{
			
				res.json( {response: 0, msg: "Sign in or sign up if not a member yet" });
			}
				
				
			
	});
}

function ajax (app){
	
	app.post("/ajax", (req, res) => {
		
		
		Blog.findById(req.body.post_id).populate("comments").exec((err, blog) => {
			
			if(err){
			   
				return console.log(err);
			}
			
			if(blog){
				
										
				let newComments = [];

				blog.comments.forEach( function (comm, index){

					let date = comm.date.toDateString();

					newComments.push({ 
						   id:       comm.id, 
						   username: comm.username, 
						   date:     date,
						   text:     comm.text
						 }); 


				});

				console.log(newComments);

				res.json( { response: 1,  msg: newComments});

			}

			
		});
		
	});

	
	
}

	

module.exports.adding_comments   =    adding_comments;

module.exports.ajax   =    ajax;

