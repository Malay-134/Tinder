const express = require("express")

const app = express(); 

app.use("/test",(req,res) => {
    res.send("This is beta version")
})

app.use("/about",(req,res) => {
    res.send("About page")
})

app.use("/",(req,res) => {
    res.send("Home page")
})

app.listen(3000,() => {
    console.log("Server started successfully")
})