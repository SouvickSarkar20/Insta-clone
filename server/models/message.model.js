import mongoose from "mongoose";

const messageSchema = new mongoose.connect({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    message : {
        type : String,
        required : true,
    }
});

export default Message = mongoose.model('Message',messageSchema);