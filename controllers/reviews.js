const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.createReview = async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    let str=req.body.review.comment
    if(str.trim()===""){
        req.flash("error" , "Response Empty");
    }else{
        req.flash("success" , "Response Added");
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
    }
    
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let{id , reviewId}=req.params;
    req.flash("success" , "Response Deleted");
    await Listing.findByIdAndUpdate(id , { $pull : { reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
};
