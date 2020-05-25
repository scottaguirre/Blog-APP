let express       = require("express");
let app           = express();
let session       = require("express-session");
let mongoose      = require("mongoose");
let mongoosePassport   = require("passport-local-mongoose");
let bodyParser    = require("body-parser");
let ejs           = require("ejs");
let passport      = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let User          = require("./models/user").User;
let Comments      = require("./models/comments").Comment;
let override      = require("method-override");


const uri = "mongodb+srv://scottaguirre:EiSa170283@scottaguirre-p6nlt.mongodb.net/blog?retryWrites=true";

mongoose.connect(uri, { useNewUrlParser: true });

let blog_controller          = require('./controllers/blog');
let user_controller          = require('./controllers/users');
let comments_controller      = require('./controllers/comments');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(override("_method"));

app.use(session({
	secret: "Edwin is the best",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Passing req.user to all routes

app.use(function(req, res, next){
	
	if(req.user) {
		app.locals.currentUser = req.user;
	} else {
		app.locals.currentUser = undefined;
	}
	
	next();
});


// Check if user is logged in

function isLoggedIn(req, res, next){
	
	if(req.isAuthenticated()){
		
		return next();	
	}
	
}


// finding users and levels
user_controller.finding_all_users(app);


// finding a user
user_controller.finding_a_user(app);


// show form to add users
//user_controller.form_to_add_users(app);


// form to add users

user_controller.form_to_add_users(app);

// adding new user to DB
user_controller.adding_new_user(app);

// Showing all posts
blog_controller.show_all_posts(app);

// Showing individual post
blog_controller.show_individual_post(app);

// Create new post
blog_controller.create_post(app);

// Form to create post
blog_controller.form_to_create_post(isLoggedIn, app);

// Update article
blog_controller.update_article(isLoggedIn, app); 

// form to Update article
blog_controller.form_to_update_article(isLoggedIn, app);

// Log In
user_controller.sign_in(app); 

// Log out
user_controller.logout(app);

// check level of users for comments 
comments_controller.adding_comments(app);


// ajax 
comments_controller.ajax(app);


// Go back link
//controller.go_back(app);

app.listen(process.env.PORT || 3000, () => {
	
	console.log(`Working on port 3000`);
});
