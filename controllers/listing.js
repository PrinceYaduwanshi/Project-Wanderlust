const { Model } = require("mongoose");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res,next)=>{
    const alllistings = await Listing.find();
    res.render("./listings/index.ejs",{alllistings});
};

module.exports.renderNewForm =  (req,res,next)=>{
    res.render("./listings/new.ejs");
};

module.exports.show = async(req,res,next)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id).populate({path:"reviews" , populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Does not Exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs" , {listing});
};

module.exports.addNew = async(req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
        
    let url = req.file.path;
    let filename = req.file.filename;
    // if(!req.body.listing){
    //     throw new ExpressError(404,"Send Valid Data for Listing")
    // }
    //let{title , description, image, price, country, location} = req.body;
    req.flash("success" , "Added Successfully");
    const newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={filename,url};
    newlisting.geometry=response.body.features[0].geometry;

    let savedlisting=await newlisting.save();
    console.log(savedlisting);
    
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res,next)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Does not Exist");
        res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload" , "/upload/w_200,h_150");
    res.render("./listings/edit.ejs",{listing,originalUrl});
};

module.exports.edit = async(req,res,next)=>{
    let{id}=req.params;
    let list=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        list.image={filename,url};
        await list.save();
    }

    req.flash("success" , "Edit Completed");
    res.redirect("/listings"); 
};

module.exports.destroy = async(req,res,next)=>{
    let {id} = req.params;
    req.flash("success" , "Deleted Successfully");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
};
