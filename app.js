const express = require("express")
const mongoose = require("mongoose")
const userRoute = require("./routes/userRoute")
const accountRoute = require("./routes/accountRoute")
const cors = require("cors")
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/user" , userRoute)
app.use("/api/v1/account" , accountRoute)

mongoose.connect("mongodb://127.0.0.1:27017/paytm")
    .then(()=>{console.log("Mongodb connected")})

app.listen(4000 , ()=>{
    console.log("Server started")
})