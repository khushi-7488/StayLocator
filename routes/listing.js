const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js")


// validation as middleware 
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }

}


// index route 
router.get("/", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })

})

// new route 
router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs",)
}))

// create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body;
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        throw new ExpressError(400, result.error)
    }
    let listingData = req.body.listing;
    listingData.image = { url: listingData.image };
    let newListing = new Listing(listingData);
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
}

))

// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}))

// update route 
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = { ...req.body.listing };
    updatedListing.image = { url: req.body.listing.image }
    await Listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success", " listing updated");

    res.redirect("/listings");
}))

// delete route 
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
}))

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews")
    if(!listing){
        req.flash("error", "Listing is not existing")
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}))

module.exports = router;