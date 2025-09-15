const express = require("express")
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected")
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("hii i am root")
})

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
})

// new route 
app.get("/listings/new", async (req, res) => {
    res.render("listings/new.ejs",)
})

// create route
app.post("/listings", wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body;
if(!req.body.listing){
    throw new ExpressError(404, "sent valid data for listing") 
}
    let listingData = req.body.listing;
    listingData.image = { url: listingData.image };
    let newListing = new Listing(listingData);
    await newListing.save();
    res.redirect("/listings");
}

))

// edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}))

// update route 
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if(!req.body.listing){
    throw new ExpressError(404, "sent valid data for listing") 
}

    let { id } = req.params;
    let updatedListing = { ...req.body.listing };
    updatedListing.image = { url: req.body.listing.image }
    await Listing.findByIdAndUpdate(id, updatedListing);
    res.redirect("/listings");
}))

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
}))


// app.get("/testListing", (req, res) => {
//     let sampleListing = new Listing({
//         title: "my new Villa",
//         description: "By the bich",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })

app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404, "page not found"))
})

app.use((err, req, res, next) => {
    let{statusCode = 500, message = "something went wrong"} = err ;
    res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("server is listening")
})