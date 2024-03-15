// get video details
const ytdl= require("ytdl-core");
exports.getVideoDetails=async(req,res)=>{
    try {
        const userId = req.user.id;
        console.log("user id -->",userId);
        const {videoUrl} = req.body;
        console.log("video url -->",videoUrl);
        const videoId= new URLSearchParams(new URL(videoUrl).search).get('v');
        console.log("video id -->",videoId);
        const videoInfo = await ytdl.getInfo(videoId);

        console.log("videoInfo is -->",videoInfo.videoDetails);
    } catch (error) {
        
        console.log("Error aa gya jii -->",error);
    }
}