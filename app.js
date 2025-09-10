const express = require("express")
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "/public")))
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);


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
app.post("/listings", async (req, res) => {
    // let {title, description, image, price, country, location} = req.body;
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

// edit route
app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
})

// update route 
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
})

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

// show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
})


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

app.listen(8080, () => {
    console.log("server is listening")
})