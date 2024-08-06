const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", {allListings});
}

module.exports.new = (req, res) => {
    // console.log(req.user);
    // // For the sake of authentication req.authenticated() is given by the passport authentication
    // if(!req.isAuthenticated()){
    //     req.flash("failure","You Must be Logged in first to create listing!")
    //     res.redirect("/login")
    // }

    res.render("listings/new.ejs");
}

module.exports.create = async (req, res, next) => {
    // let {title,description,image,country,price,location} = req.body;
    // let listing = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing)
    // console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image = {url , filename}
    await newListing.save();
    // Here is Flash Message is Created
    req.flash("success", "New Listing is Created!");
    res.redirect("/listings")

}

module.exports.show = async (req, res) => {
    let {id} = req.params;
    // let listing = await Listing.findById(id);
    // Populated it to get the objetId plus rating and comments
    const listing = await Listing.findById(id).populate({
        path: 'reviews', //nested populstion of reviews to get the info of authers as well
        populate: {
            path: "author"
        }
    }).populate("owner");
    if (! listing) {
        res.flash("failure", "The Listing you are trying to access is no more exists")
        re.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/showRoute.ejs", {listing})
}

module.exports.edit = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (! listing) {
        res.flash("failure", "The Listing you are trying to access is no more exists")
        re.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250")
    res.render("listings/edit.ejs", {listing , originalImageUrl});
}

module.exports.update = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing
    });
    if(typeof req.file !="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename}
        await listing.save()
    }
    req.flash("success", " Listing is Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing is Deleted!");
    res.redirect("/listings")

}