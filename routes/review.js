const express = require("express");
//This will merge your parent with child
const router = express.Router({mergeParams:true}); 
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const Review =require("../models/reviews.js");
const { validateReview, isLoggedIn,isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js")

//Reviews
//Post Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview))

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));



module.exports = router;