const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs",)
}

module.exports.create = async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body;
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        throw new ExpressError(400, result.error)
    }
    let listingData = req.body.listing;
    listingData.image = { url: listingData.image };
    let newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
}

module.exports.update = async (req, res) => {
    let { id } = req.params;
    let updatedListing = { ...req.body.listing };
    updatedListing.image = { url: req.body.listing.image }
    await Listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success", " listing updated");

    res.redirect(`/listings/${id}`);
}

module.exports.delete =async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing is not existing")
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}






