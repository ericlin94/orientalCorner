var express=require("express");
var app= express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var User=require("./models/user");
var Resturant=require("./models/resturant");
var Comment=require("./models/comment");
var seedDB=require("./seeds");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var flash=require("connect-flash");
//requiring routes
var commentRoutes   =require("./routes/comments"),
    resturantRoutes =require("./routes/resturants"),
    indexRoutes     =require("./routes/index");

mongoose.connect("mongodb://localhost/oriental_corner");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();//seed the database

//PASSPORT CONFIGURATION
//========================
app.use(require("express-session")({
    secret:"There is no Secrete in the world.",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//========================
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/resturants",resturantRoutes);
app.use("/resturants/:id/comments",commentRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The orientalCorner Server Has Started!");
});