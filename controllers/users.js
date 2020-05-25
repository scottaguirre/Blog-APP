let User						   = require("../models/user").User;
let Comment						   = require("../models/comments").Comment;
let passport                       = require("passport");
let LocalStrategy                  = require("passport-local").Strategy;
let mongoosePassport               = require("passport-local-mongoose");
const { check, validationResult }  = require('express-validator/check');


function form_to_add_users(app){
	
	app.get("/form_to_add_users", (req, res) => {
		
		res.render("form_to_add_users");
		
	});
}

function adding_new_user(app){
	
	
	
	app.post("/adding_new_user", [ 
  			
  			check('name', 'Enter Your Name').not().isEmpty().trim().escape(),
			check('lastname', 'Enter Your Last Name').not().isEmpty().trim().escape(),
			check('username', 'Enter a Username').not().isEmpty().trim().escape(),
			check('email', 'Your email is not valid').not().isEmpty().isEmail().normalizeEmail(),
			check('password').not().isEmpty().isLength({min: 5}).withMessage('Your password must be at least 5 characters').trim().escape(),
			check('password2').not().isEmpty().withMessage('Enter confirmation password').trim().escape(),
			check('level').not().isEmpty()
		],	(req, res) => {
		
			let { name, lastname, username, email, password, password2, level} = req.body;
		 
			let errors;
		
			errors = validationResult(req);
		
			let pass_errors = [];
						
			if(password !== password2){
							
				pass_errors.push({ msg: "Passwords have to match"});
				
				console.log(pass_errors);
				
			}
			
				
		
  			if (!errors.isEmpty()) {
							
				errors = errors.array();

				
				let filtered_errors = errors.filter( error => {
					if(error.param != "password" && error.param != "password2"){
						return error;
					}
				});
				
				
				let pass_error = errors.filter( error => {
					
					if(error.param == "password"){
					 
						if(error.msg == 'Your password must be at least 5 characters'){
							return error;
						}
					} 
				
				});
				
				let conf_pass_error = errors.filter( error => {
				
					if(error.param == "password2"){
						if(error.msg == 'Enter confirmation password'){
							return error;
						}
					}		 
				
				});
				 
				if(pass_error.length != 0 || conf_pass_error.length != 0){
				   
					pass_errors = pass_error.concat(conf_pass_error);
					
				} 
		
				errors = filtered_errors.concat(pass_errors);
				
				console.log(errors);
				
				res.render("form_to_add_users", 
						   {errors, name, lastname, username, email, password, password2 }
				);
				
				return; 
   				
  			} else {
				
				if(pass_errors.length == 0){
				
					let info = {
							name:     req.body.name,
							lastname: req.body.lastname,
							username: req.body.username,
							email:    req.body.email,
							level:    req.body.level
							};
				
				
					User.find({ email }, (err, user) => {

						if (err) {
							console.log(err);

						}
						
						console.log(user);

						if(user.length > 0){

							
							errors = [];

							errors.push({ msg: "This email is already registered"});

							console.log(errors);

							res.render("form_to_add_users", {errors, name, lastname, username, email, password, password2});

							return;

						} else {

							User.register( new User(info), password, (err, user) =>{

								if(err) {

								errors = [];

								errors.push({ msg: "Username already taken"});

								console.log(errors);

								res.render("form_to_add_users", {errors, name, lastname, username, email, password, password2});

								return;
								}

							passport.authenticate("local")(req, res, () => {

								res.redirect("/");	

							}); 


							});


						}
					});

				} else {
					
					errors = pass_errors;
				
					console.log(errors);

					res.render("form_to_add_users", 
							   {errors, name, lastname, username, email, password, password2 }
					);

					return; 
				}
			}
	});

}


function finding_all_users(app){
	
	app.get("/finding_all_users", (req, res) => {
	
		
	User.find({}, (err, users) =>{
		
		if(err) console.log(err);
		
		console.log(users);
		
		res.redirect("/");
		
		
	});	
		
	
});

}

function finding_a_user(app){
	
	app.post("/finding_a_user", (req, res) => {
	
		let email = req.body.email,
			pass   = req.body.pass;
		
	User.find({email, pass}, (err, user) =>{
		
		if(err) console.log(err);
		
		console.log(user);
		
		res.redirect("/");
		
		
	});	
		
	
});

}

function sign_in (app){
	
	app.get("/sign_in", (req, res) => {
		
		res.render("login");
		
	});
	
	
	app.post("/sign_in", passport.authenticate('local', { failureRedirect: '/sign_in' }),
			 
 			(req, res) => {
		
			
    		res.redirect('/');
	});
}


function logout(app){
	
	app.get("/logout", (req, res) =>{
		
		req.logout();
		
		res.redirect("/");
	});
}



module.exports.sign_in           = sign_in; 
module.exports.logout            = logout; 
module.exports.adding_new_user   = adding_new_user;
module.exports.finding_a_user    = finding_a_user;
module.exports.finding_all_users = finding_all_users;
module.exports.form_to_add_users = form_to_add_users;

