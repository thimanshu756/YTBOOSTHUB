const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth= async(req,res,next)=>{
    try {
        console.log("Inside Auth");
        const token = req.cookies.token||req.body.token||req.header("Authorization").replace("Bearer ","");
        console.log("token is -->", token);

        if(!token){
            return res.status(500).json({
                message:"Token is missing",
                success:false
            })
        }
        try {
            const decode = await jwt.verify(token , process.env.JWT_SECRET);
            console.log("decode is -->",decode);
            req.user=decode;

        } catch (error) {
            return res.status(401).json({
                message:"Token is missing",
                success:false
            })
        }
        next();
    } catch (error) {
        console.log("error in auth -->",error);
        return res.status(401).json({
            message:"Something went wrong while validating the token",
            sucess:false
        })
    }
}

exports.isUser=(req,res,next)=>{
    try {
        console.log("Inside isUser");
        if(req.user.accountType!="User"){
            return res.status(401).json({
                sucess:false,
                message:"You are not authorised to enter in User"
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            sucess:false,
            message:"User role cannot be verified please try again"
        })
    }
}


exports.isAdmin=(req,res,next)=>{
    try {
        if (req.user.accountType!=="Admin") {
            return res.status(401).json({
                sucess:false,
                message:"You are not authorised to enter in Admin"
            })}
            next();
    } catch (error) {
        return res.status(401).json({
            sucess:false,
            message:"Admin role cannot be verified please try again"
        })
    }
}