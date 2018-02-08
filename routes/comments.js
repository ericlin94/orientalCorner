var express=require("express");
var router=express.Router({mergeParams:true});
var Resturant=require("../models/resturant");
var Comment=require("../models/comment");
var middleware=require("../middleware");


//Comments new
router.get("/new",middleware.isLoggedIn,function(req, res) {
   Resturant.findById(req.params.id,function(err,resturant){
       if(err){
           console.log(err);
       }else{
           res.render("comments/new",{resturant:resturant}); 
       }
   }); 
});
//Comments create
router.post("/",middleware.isLoggedIn,function(req,res){
   Resturant.findById(req.params.id,function(err, resturant) {
       if(err){
           console.log(err);
           res.redirect("/resturants");
       }else{
           Comment.create(req.body.comment,function(err,comment){
               if(err){
                   console.log(err);
               }else{
                   //add username and id to comment
                   comment.author.id=req.user._id;
                   comment.author.username=req.user.username;
                   //save comment
                   comment.save();
                   resturant.comments.push(comment._id);//The difference
                   resturant.save();
                   req.flash("success","Successfully added comment");
                   res.redirect("/resturants/"+resturant._id);
               }
           });
       }
   }) ;
});


//Comments edit

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Resturant.findById(req.params.id,function(err, resturant) {
       if(err){
           req.flash("error","Resturant not found");
           return res.redirect("back");
       } 
        Comment.findById(req.params.comment_id,function(err, foundComment) {
            if(err){
                res.redirect("back");
            }else{
                res.render("comments/edit",{resturant_id:req.params.id,comment:foundComment});
            }
        });
    });
    
});

//Comment update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/resturants/"+req.params.id);
        }
    });
});
//comment destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("Comment deleted");
            res.redirect("/resturants/"+req.params.id);
        }
    });
});

module.exports=router;