const cloudinary = require("cloudinary").v2;

exports.cloudinaryConnect=()=>{
    try {
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET,
        })

        console.log("Connected to cloudinary");
    } catch (error) {
        console.log("Error in connecting the cloudinary -->",error);
    }
}