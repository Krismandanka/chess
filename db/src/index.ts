
// import express from "express"
import express, { Request, Response } from "express";
// const express=require('express');

const app=express();


// const database=require('./config/database');
import { dbConnect } from "./config/database";
const cookieParser=require("cookie-parser")

const cors=require('cors');

const dotenv=require("dotenv")
dotenv.config();


const PORT=process.env.PORT || 5000;
// database.connect();
dbConnect();


app.use(express.json());
app.use(cookieParser());

app.use(cors(
    {
        origin: ["https://study-notion-eta.vercel.app","http://localhost:3000","www.studynotion.fun","studynotion.fun","https://studynotion.fun","https://www.studynotion.fun","http://127.0.0.1:3000"],
        credentials: true,
    }
));


app.get("/",(req:Request, res:Response)=>{
    res.status(200).json({
        message:"Welcome to the API"
    })});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})