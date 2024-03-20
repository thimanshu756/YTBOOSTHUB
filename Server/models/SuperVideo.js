const mongoose = require("mongoose");

const superVideoSchema = new mongoose.Schema({
    title:{
        type:String,

    },
    duration:{
        type:String, // look again here 
    },
    useId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    description:{
        type:String
    },
    thumbnail:{
        type:String
    },
    points:{
        type:Number
    }

})

module.exports = mongoose.model("SuperVideo",superVideoSchema);