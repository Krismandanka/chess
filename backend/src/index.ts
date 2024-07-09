import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import WebSocket from 'ws';
import GameDb from './models/GameDb';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  console.log("web socket connected")
  gameManager.addUser(ws);
  ws.on("disconnect",()=>gameManager.removeUser(ws));
});




// import express from "express"
import express, { Request, Response } from "express";
// const express=require('express');
var bodyParser = require('body-parser')

const app=express();


// const database=require('./config/database');
import { dbConnect } from "./config/database";
import MoveDb from './models/MoveDb';
import User from './models/User';
const cookieParser=require("cookie-parser")

const cors=require('cors');

const dotenv=require("dotenv")
dotenv.config();


const PORT=process.env.PORT || 5000;
// database.connect();
 dbConnect();


app.use(express.json());
app.use(cookieParser());
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors(
    {
        origin: ["https://study-notion-eta.vercel.app","http://localhost:3000","http://localhost:5173","www.studynotion.fun","studynotion.fun","https://studynotion.fun","https://www.studynotion.fun","http://127.0.0.1:3000"],
        credentials: true,
    }
));


app.get("/",(req:Request, res:Response)=>{
    res.status(200).json({
        message:"Welcome to the API"
    })});

app.get("/gamearchive/:id",async (req:Request,res:Response)=>{
  const gameId = req.params.id;
  try {
    const game:any  =  await GameDb.findById({_id:gameId});
    return res.status(200).json({
      success: true,
      moves:game.moves,
    });
  } catch (error) {
    console.log("game arch error",error);
    return res.status(400).json({
      success: false,
      message: `Please Fill up All the Required Fields`,
    });
  }

})
app.get("/move/:id",urlencodedParser,async (req:Request,res:Response)=>{
  const gameId = req.params.id;
  try {
    const move:any  =  await MoveDb.findById({_id:gameId});
    return res.status(200).json({
      success: true,
      move,
    });
  } catch (error) {
    console.log("game arch error",error);
    return res.status(400).json({
      success: false,
      message: `Please Fill up All the Required Fields`,
    });
  }

})

app.get("/gamehistory/:id",async (req:Request,res:Response)=>{
  console.log("reqqq")
  const email=req.params.id;
  console.log("email",email)
  try {
    const user=await User.findOne({email:email});
    // const gameAsWhite = user.gameAsWhite;
    // const gameAsBlack = user.gameAsBlack;
    console.log("uuuser",user?.gameAsBlack)
    const gameWhite = user?.gameAsBlack;
    const gameBlack = user?.gameAsWhite;
    
    return res.status(200).json({
      success: true,
      gameWhite,
      gameBlack
    });

    
  } catch (error) {
    console.log("game arch error",error);
    return res.status(400).json({
      success: false,
      message: `Please Fill up All the Required Fields`,
    });
  }

})




app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})