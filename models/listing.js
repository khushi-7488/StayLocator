const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filname: String,
        // set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1689843658573-b1c234d46842?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing; 