const User = require("../models/Users");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const mailSender = require("../utils/mailSender");
dotenv.config();


exports.sendOtp= async(req,res)=>{
    console.log("send otp func called");
    try {
        const {email}= req.body;
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        // else generate otp
        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })

        const result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            result = await OTP.findOne({otp:otp});
        }
        const otpPayload = {email , otp}
        const otpBody = await OTP.create(otpPayload);

        return res.status(200).json({
            success:true,
            message:"Otp generated successfully",
            otp:otp
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Getting error while sending the Otp',
            error:error.message
        })
    }
}

exports.signUp=async(req,res)=>{
    console.log("signUp func called");

    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            accountType
        }=req.body;
        console.log("accountType -->",accountType);
        if (!firstName) {
            return res.status(400).json({
                success:false,
                message:"please enter first name"
            }) 
        }
        if (!lastName) {
            return res.status(400).json({
                success:false,
                message:"please enter last name"
            }) 
        }
        if (!email) {
            return res.status(400).json({
                success:false,
                message:"please enter email "
            }) 
        }
        if (!password) {
            return res.status(400).json({
                success:false,
                message:"please enter password "
            }) 
        }
        if (!confirmPassword) {
            return res.status(400).json({
                success:false,
                message:"please enter confirmpass "
            }) 
        }
        if (!otp) {
            return res.status(400).json({
                success:false,
                message:"please enter otp "
            }) 
        }
        // match the both password
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password dont match"
            })
        }
        // check if user is already exists or not
        const userExists= await User.findOne(
            {email}
        )
        if (userExists) {
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const recentOtp= await OTP.find({email}).sort({createdAt:-1}).limit(1);

        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:"Getting invalid otp from DB"
            })
        }else if(otp!=recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"Invalid otp entered"
            })
        }
        let type;
        if(!accountType){
            type="User"
        }else{
            type=accountType
        }
        // hash the password
        const hashedPass= await bcrypt.hash(password,10);
        // create an entry in db
        const user= await User.create({
            firstName,
            lastName,
            email,
            password:hashedPass,
            accountType:type,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });
        return res.status(200).json({
            success:true,
            message:"You are registerd sucessfully",
            user
        })
    } catch (error) {
        console.log("error ->",error);
        return res.status(500).json({
            success:false,
            message:'Getting error Signing up',
            error:error.message
        })
    }
}

// login controller

exports.login=async(req,res)=>{
    try {
        const {email , password}= req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please enter all the fields properly"
            })
        }
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:'You are not registerd with us please signUp',
            })
        }
        console.log("user is -->",user);
        if(await bcrypt.compare(password ,user.password)){
            const payload= {
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token= await jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })

            console.log("token is -->",token);
            user.token=token;
            user.password= undefined;
            console.log("user's token is  -->",user.token);
            const lastLogin = new Date(user.lastLogin).setHours(0, 0, 0, 0);
            const today = new Date().setHours(0, 0, 0, 0);
            if (lastLogin !== today) {
                user.coins += 10;
                user.lastLogin = Date.now();
                await user.save();
            }
            const options= {
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"Logged in sucessfully",
                token,
                user
            })
        }else{
            return res.status(401).json({
                success:false,
                message:`password is incorrect`
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Getting error in login',
            error:error.message
        })
    }
}