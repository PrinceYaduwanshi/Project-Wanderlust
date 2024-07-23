const express=require("express");
const router=express.Router({mergeParams:true});
// set mergeparams true for sending complete route to file including parameters

const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expresserror.js");
const { reviewSchema }=require("../schema.js");
const { isLoggedin, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
       //extracting error message from error 
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

// POST REVIEW ROUTE
router.post("/",validateReview, isLoggedin ,wrapAsync(reviewController.createReview));

// POST DELETE ROUTE
router.delete("/:reviewId" ,isLoggedin ,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;