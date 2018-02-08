var express=require("express");
var router=express.Router();
var Resturant=require("../models/resturant");
var middleware=require("../middleware");
//index route
router.get("/",function(req,res){
    Resturant.find({},function(err,resturants){
        if(err){
            console.log(err);
        }else{
            res.render("resturants/index",{resturants:resturants});
        }
    });
});
//create route
router.post("/",middleware.isLoggedIn,function(req,res){
   var name=req.body.name;
   var price=req.body.price;
   var image=req.body.image;
   var desc=req.body.description;
   var author={
       id:req.user._id,
       username:req.user.username
   };
   var newResturant={price:price,name:name,image:image,description:desc,author:author};
   Resturant.create(newResturant,function(err,newlyCreated){
       if(err){
           console.log(err);
       }else{
           res.redirect("/resturants");
       }
   });
});
//new route
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("resturants/new");
});
//show route
router.get("/:id",function(req,res){
    Resturant.findById(req.params.id).populate("comments").exec(function(err,foundResturant){
       if(err||!foundResturant){
           req.flash("error","Resturant not found");
           res.redirect("back");
       } else{
           res.render("resturants/show",{resturant:foundResturant});
       }
    });
});
//edit route
router.get("/:id/edit",middleware.checkResturantOwnership,function(req, res) {
    Resturant.findById(req.params.id,function(err,foundResturant){
        if(err){
            console.log(err);
        }
        res.render("resturants/edit",{resturant:foundResturant});
    });
});

//update route
router.put("/:id",middleware.checkResturantOwnership,function(req,res){
    //find and update the correct resturant
    Resturant.findByIdAndUpdate(req.params.id,req.body.resturant,function(err,updatedResturant){
        if(err){
            res.redirect("/resturants");
        }else{
            res.redirect("/resturants/"+req.params.id);
        }
    });
    //redirect somewhere(show page)
});
//destroy route
router.delete("/:id",middleware.checkResturantOwnership,function(req,res){
    Resturant.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/resturants");
        }else{
            res.redirect("/resturants");
        }
    });
});


module.exports=router;