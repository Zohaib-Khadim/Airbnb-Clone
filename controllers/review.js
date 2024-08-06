const Listing = require("../models/listing.js")
const Review = require("../models/reviews.js")

module.exports.postReview = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review (req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
    req.flash("success","New Review is Created!");
    console.log("New Review is Saved");
    }

module.exports.deleteReview = async(req,res,next)=>{
    let {id ,reviewId} = req.params;
// $pull operator is used to remove the existing values of the array whom we are going to target
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success"," Review is Deleted!");
    res.redirect(`/listings/${id}`)
}