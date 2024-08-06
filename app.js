if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session")
const MongoStore = require('connect-mongo')
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy=require("passport-local")
const User = require("./models/user.js")
const PORT = 8080;

// const MONGOOSE_URL = process.env.ATLUS_URL;
const dbUrl = process.env.ATLUS_URL;

main().then(() => {
    console.log("Connected to DB Successfully");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Mongo Session Store........>By using this our session info is stored in the AtlasDb Before using this our info is stored in  the local databases.

const store = MongoStore.create({
    mongoUrl :dbUrl,
    crypto:{
        secret :"mySuperSecret",
    },
    touchAfter : 24*3600,
})

// Mongo session stores handling

store.on("ERROR",()=>{
    console.log("Error in the mongo session store",err);
})


// session Options
const sessionOptions = {
    store,
    secret: "mySuperSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}

// app.get("/", (req, res) => {
//     res.send("Hi , I'm root")
// });
//Use Of Seesion Pakage
app.use(session(sessionOptions));
//Use Of Flash Pakage
app.use(flash())

//Passport Authentication 

//Initialize Passport
app.use(passport.initialize());
//This means session has to be implemented first then you have to use passport which is necessary for the pasport authentication
app.use(passport.session());
//use static authenticate method  of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

//Support Sesion
passport.serializeUser(User.serializeUser());//Store user in the session
passport.deserializeUser(User.deserializeUser());//stored user  removed from session

//MiddleWare for the Flash Messages
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.currUser = req.user;
    next();
})

// // demo user
// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"abc@gmail.com",
//         username:"ebc",

//     })

// // Storing the fake user username and password in second parameter
//   let registredUser = await User.register(fakeUser,"abc")
//   res.send(registredUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/",userRouter)


// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Karachi , Korangi",
//         country:"Pakistan "
//     })

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successsful testing");
// })

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

// app.use((err,req,res,next)=>{
//     let {statusCode=500,message="Something Went Wrong"} = err;
//     res.status(statusCode).render("error.ejs",{message});
//     // res.status(statusCode).send(message)
// })

app.use((err, req, res, next) => {
    let {
        statusCode = 500,
        message = "Something Went Wrong"
    } = err;
    if (!err.message) 
        err.message = "Oh No, Something Went Wrong!";
    
    res.status(statusCode).render('error.ejs', {message});
});

app.listen(PORT, () => {
    console.log(`Your Server is Running on the Port number ${PORT}`);
})
