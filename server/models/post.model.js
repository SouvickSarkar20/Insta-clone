import mongoose from "mongoose";


const postSchema = new mongoose.connect({
    caption : {type:String,default:''},
    image : {type:String,required:true},
    author : {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    likes : [{type:mongoose.Schema.Types.ObjectId,ref:'Likes'}],
    comments : [{type:mongoose.Schema.Types.ObjectId,ref:Comment}],
});

export default Post = mongoose.model('Post',postSchema);