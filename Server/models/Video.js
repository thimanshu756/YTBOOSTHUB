const mongoose = require("mongoose");


const videoSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    video:{
        type:String
    },
    views:{
        type:Number,
        default:0
    }
})
module.exports = mongoose.model("Video",videoSchema);