const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../templates/emailVerificationTemplate")
const otpSchema = new mongoose.Schema({
email:{
    type:String,
},
otp:{
    type:String,
    required:true,
},
createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60,
}
});

// a function --> to send email

async function sendverificationEmail(email ,otp){
    try {
        const mailResponse = await mailSender(email , "verification Email from YTBOOSTHUB", otpTemplate(otp));
    } 
    catch (error) {
        console.log("Getting error while sending mails :" , error);
        throw error;
    }
}
// pre call
otpSchema.pre("save",async function (next){
    await sendverificationEmail(this.email , this.otp);
    next();
})
module.exports = mongoose.model("OTP ",otpSchema);