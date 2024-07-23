const User=require("../models/user.js");
const passport = require("passport");

module.exports.renderSignUpForm = (req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.usersignup = async(req,res)=>{
    try{
        let{ username , email , password}=req.body;
        let newUser=new User({email , username});
        let registeredUser=await User.register(newUser,password);
        req.login(registeredUser , (err)=>{
            if(err){
                return next(err);
            }else{
                req.flash("success" , "Welcome");
                res.redirect("/listings");
            }
        })
        
    }catch(err){
            req.flash("error" , err.message);
            res.redirect("/signup");
        }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.userlogin = async(req,res)=>{
    req.flash("success" , "Welcome Back");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    
};

module.exports.userlogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","Looged Out");
            res.redirect("/listings");
        }
    })
};