import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async(req,res) => {
    try{
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({
                message : "Something went wrong",
                success : false,
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message : "Try another email",
                success : false,
            })
        };
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            password:hashedPassword,
        });
        return res.status(201).json({
            message : "Account created successfully",
            success : true,
        })

    }
    catch(error){
        console.log(error);
    }
}

export const login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message : "Something went wrong",
                success : false,
            })
        }
        let user = await User.findOne({email});
        if(!user){
            res.status(401).json({
                message : "Something went wrong",
                success : false,
            })
        }
        const isPassword = await bcrypt.compare(password,user.password);
        if(!isPassword){
            res.status(401).json({
                message : "Something went wrong",
                success : false,
            })
        }

        //adding info to user so that we can send it to the frontend 
        user = {
            _id : user._id,
            username : user.username,
            email : user.email,
            profilePicture : user.profilePicture,
            bio : user.bio,
            followers : user.followers,
            following : user.following,
            posts : user.posts,
        }
        const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
            message : `welcome back ${user.username}`,
            success : true,
            user,
        })
    }
    catch(error){
        console.log(error);
    }
};

export const logout = async (req,res)=>{
    try{
        return res.cookie("token", " " , {maxAge:0}).json({
            message : 'Logged out successfully',
            success : true,
        });
    }
    catch(error){
        console.log(error);
    }
};

//we will get the profile of any user through his id and that id we will get from the req body only 
export const getProfile = async (req,res)=>{
    try{
        const userId = req.params.id;
        let user = await User.findById(userId).select('-password');
        return res.status(200).json({
            message : "user details fetched successfully",
            user,
            success:true,
        });
    }
    catch(error){
        console.log(error);
    }
};

//edit the user profile 
export const editProfile = async(req,res)=>{
    try{
        const userId = req.id;
        const {bio,gender} = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message : "user not found",
                success : false,
            })
        };
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse?.secure_url;

        await user.save();

        return res.status(200).json({
            message : "Profile updated",
            success : true,
            user,
        })
    }
    catch(error){
        console.log(error);        
    }
}

export const getSuggestedUsers = async(req,res) => {
    try{
        const suggestedUsers = User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(400).json({
                message : 'Currently do not have any users'
            })
        };
        return res.status(200).json({
            success : true,
            users : suggestedUsers,
        })
    }
    catch(error){
        console.log(error);        
    }
};

export const followOrUnfollow = async (req,res)=>{
    try{
        const follower  = req.id;
        const following = req.params.id;
        if(follower === following){
            return res.send(400).json({
                message : "you cant follow or unfollow urself",
                success : false,
            })
        }

        const user = await User.findbyId(follower);
        const targetuser = await User.findbyId(following);

        if(!user || !targetuser){
            return res.status(400).json({
                message : 'user not found',
                success:false,
            })
        }

        const isFollowing = user.following.includes(following);

        if(isFollowing){
            //if u are already following that person then unfollow him
            await Promise.all([
                User.UpdateOne({_id:follower},{$pull:{following:following}}),
                User.UpdateOne({_id:following},{$pull:{follower:follower}}),
            ])
            return res.status(200).json({
                message : "unfollowed successfully",
                success : true,
            })
        }
        else{
            await Promise.all([
                User.UpdateOne({_id:follower},{$push:{following:following}}),
                User.UpdateOne({_id:following},{$push:{follower:follower}}),
            ])
            return res.status(200).json({
                message : "Followed successfully",
                success : true,
            })
        }
    }
    catch(error){
        console.log(error);        
    }
};



