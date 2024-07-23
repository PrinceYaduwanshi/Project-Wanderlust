const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title:{
        type:String,
        required:String,
    },
    description:{
        type:String,
    },
    image:{
        filename:String,
        url:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    }
});

// Mongoose delete middleware
listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : { $in: listing.reviews }});
    }
});

const Listing=mongoose.model("Listing" , listingSchema);

module.exports=Listing;