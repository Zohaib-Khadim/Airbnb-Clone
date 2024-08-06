const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js")
const { listingSchema, reviewsSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
// For the sake of authentication req.authenticated() is given by the passport authentication
module.exports.isLoggedIn = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        // console.log(req);
         
        //this logic is for that you want to do some functionality and then you need to login after login you will be redirected to that given functionality whom you were trying to done
        req.session.redirectUrl = req.originalUrl;  //here the value of the redirect will be stored in the locals bcz they are acessible everywhere you want otherwise they will show you the undefined
        req.flash("failure", "You Must be Logged in first to create listing!")
        res.redirect("/login")
    }
    next();
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    // Authorization for the edit and delelet individual listings 
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("failure","You are not the Owner of this Listing!")
       return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next()
    }
};

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewsSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=>el.message).join(",")
    throw new ExpressError (400,errMsg);
   }
   else{
    next()
   }
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    // Authorization for the edit and delelet individual listings 
    let {reviewId ,id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("failure","You are not the Author of this review!")
       return res.redirect(`/listings/${id}`)
    }
    next();
}