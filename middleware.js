const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedin = (req,res,next)=>{
    console.log(req.originalUrl);
    if(!req.isAuthenticated()){
        // redirect URl..jaha pr user jaane ke liye login kiya h
        req.session.redirectUrl=req.originalUrl;
        console.log(req.session);
        req.flash("error" , "Login First");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){  
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log('res.locals:', res.locals);
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let{id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.user._id)){
        req.flash("error" , "Permission Denied");
        return res.redirect(`/listings/${id}`);
    };
    next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let{ id , reviewId }=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.user._id)){
        req.flash("error" , "Permission Denied");
        return res.redirect(`/listings/${id}`);
    };
    next();
};