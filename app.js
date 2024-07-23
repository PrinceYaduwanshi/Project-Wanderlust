if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
};

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;

const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const path=require("path");

const ExpressError=require("./utils/expresserror.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");



app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const MONGO_URL="mongodb://127.0.0.1:27017/project";
const dbUrl = process.env.ATLASDB_URL;
main()
    .then(()=>{
        console.log("Connected to DB");
    }).catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(dbUrl);
}

app.listen(port,()=>{
    console.log(`app running on port ${port}`);
});

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24 * 3600,
})

store.on("error" , ()=>{
    console.log(err);
})

const cond={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000, //max limit in mili seconds 1sec=1000ms
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}


app.use(session(cond));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/" , (req,res,next)=>{
//     res.send("I'm ROOT");
// });

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.user=req.user;
    res.locals.redirectUrl=req.session.redirectUrl;
    next();
})

// app.get("/demouser" , async (req,res)=>{
//     let fakeuser= new User({
//         email:"prem123@gmail.com",
//         username:"PremRaj"
//     });
//     let registerUser=await User.register(fakeuser,"HellotoVSC");
//     res.send(registerUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/",userRouter);

// Miidleware error handler
app.all("*" , (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500 , message="Some New Error"} = err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});

// app.get("/testlisting" , async (req,res)=>{
//     let sample=new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:3500,
//         location:"Goa",
//         country:"India",
//     });
//     await sample.save()
//             .then(()=>{
//                 res.send("sample added");
//             }).catch((err)=>{
//                 console.log(err);
//             });
// });