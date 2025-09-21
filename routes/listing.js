const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controller/listing.js")

// index route 
router.get("/", wrapAsync(listingController.index))

// new route 
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm))

// create route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.create))

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}))

// update route 
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.update))

// delete route 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete))

// show route
router.get("/:id", wrapAsync(listingController.show))

module.exports = router;