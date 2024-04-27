const express = require("express")
const mongoose = require("mongoose")
const userRoute = require("./routes/userRoute")
const accountRoute = require("./routes/accountRoute")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/user" , userRoute)
app.use("/api/v1/account" , accountRoute)

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{console.log("Mongodb connected")})

app.listen(process.env.PORT , ()=>{
    console.log("Server started")
})