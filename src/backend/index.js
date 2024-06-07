

import dotenv from "dotenv";
import express from "express";
import ConnectDb from "./db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";


dotenv.config({path:'./.env'});

const app=express();

app.get("/",(req,res)=>{
    res.send("Hello!!");
})

app.use(cookieParser());
app.use(express.json());




app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));


import Time_zone_routes from "./routes/Time_zone_routes.js"
import auth_routes from "./routes/auth_route.js"
import User_routes from "./routes/User_routes.js"
import google_route from "./routes/google_route.js"

app.use('/auth',auth_routes);
app.use('/timezone',Time_zone_routes);
app.use('/user',User_routes)
app.use('/google',google_route)


app.use((err,req,res,next)=>{
    const errorStatus=err.status||500;
    const errorMessage=err.message||"something went wrong!";
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack,
    })
})
ConnectDb().then(()=>{
    try{
        console.log(process.env.PORT);
        app.listen(process.env.PORT|| 3001,()=>{
            console.log(`http://localhost:${process.env.PORT}`);
        })
    }catch(err){
      console.log("failed to connect to db",err);
    }

})











