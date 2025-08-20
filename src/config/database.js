const mongoose = require("mongoose")

const connectDb = async() => {
   await mongoose.connect("mongodb+srv://malay134:qZuHXvXzskKcrsSg@cluster.zue04z0.mongodb.net/tinder")
}

module.exports = connectDb;   