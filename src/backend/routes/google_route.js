import express from "express";
import {createToken }from "../controllers/google_controller.js"

const router=express.Router();


router.get("/",(req,res)=>{
    res.send("google endpoint");
})

router.post("/create-token",createToken)

export default router;