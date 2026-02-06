import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) =>{
    try{
        const {userId} = req.auth();
        const user = await clerkClient.users.getUser(userId)
        // console.log(req.user)
        if(user.privateMetadata.role != 'admin'){
            return res.json({sucess : false, message : "not authorized"})
        }
        next();
    }
    catch(err){
        return res.json({success : false, message : err.message})
    }
}