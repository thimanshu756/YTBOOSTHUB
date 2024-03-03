const express = require("express");
const app = express();
const dotenv= require("dotenv");
const database  = require("./config/database")
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());

database.connect();

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"your server is up and running"
    })
})

app.listen(PORT , ()=>{
    console.log(`App is running at ${PORT}`);
})