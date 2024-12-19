import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

//middleware 
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
    origin : 'http://localhost:5173',
    Credentials : true,
}
app.use(cors(corsOptions));

app.get('/',(req,res)=>{
    return res.status(200).json({
        message : "Hello",
        success :"true",
    })
})

app.use("/api/v1/user",userRoute);



app.listen(PORT,()=>{
    connectDB();
    console.log(`server is running on ${PORT}`);
})