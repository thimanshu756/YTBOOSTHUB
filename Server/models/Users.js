const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin","User"],
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"profile"
    },
    image:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    
},{timestamps:true})

module.exports = mongoose.model("User",userSchema);