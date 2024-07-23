const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expresserror.js");
const { listingSchema }=require("../schema.js");
const passport=require("passport");
const { isLoggedin, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");


const multer = require("multer");
const {storage} = require("../cloudinary.js");
const upload = multer({storage});

// Checking validation for Schema so that no req is sent through hoppscotch or postman services with incomplete details
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
       //extracting error message from error 
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin , upload.single("listing[image]"),validateListing, wrapAsync(listingController.addNew));
    // .post(upload.single("listing[image]"),(req,res)=>{
    //     res.send(req.file);
    // });

// index route
// router.get("/" , wrapAsync(listingController.index));

//new route
router.get("/new" , isLoggedin , listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedin , isOwner , upload.single("listing[image]") , validateListing,  wrapAsync(listingController.edit))
    .delete(isLoggedin,isOwner, wrapAsync(listingController.destroy));

// show route
// router.get("/:id" ,wrapAsync(listingController.show));

// create route
// router.post("/",validateListing, isLoggedin , wrapAsync(listingController.addNew));


// edit route
router.get("/:id/edit" ,validateListing , isLoggedin ,isOwner , wrapAsync(listingController.renderEditForm));
// router.put("/:id" ,validateListing, isLoggedin , isOwner , wrapAsync(listingController.edit));

// destroy route
// router.delete("/:id" ,isLoggedin,isOwner, wrapAsync(listingController.destroy));

module.exports=router;