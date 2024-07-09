"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const GameDb_1 = __importDefault(require("./models/GameDb"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_1.GameManager();
wss.on('connection', function connection(ws) {
    console.log("web socket connected");
    gameManager.addUser(ws);
    ws.on("disconnect", () => gameManager.removeUser(ws));
});
// import express from "express"
const express_1 = __importDefault(require("express"));
// const express=require('express');
var bodyParser = require('body-parser');
const app = (0, express_1.default)();
// const database=require('./config/database');
const database_1 = require("./config/database");
const MoveDb_1 = __importDefault(require("./models/MoveDb"));
const User_1 = __importDefault(require("./models/User"));
const cookieParser = require("cookie-parser");
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
// database.connect();
(0, database_1.dbConnect)();
app.use(express_1.default.json());
app.use(cookieParser());
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(cors({
    origin: ["https://study-notion-eta.vercel.app", "http://localhost:3000", "http://localhost:5173", "www.studynotion.fun", "studynotion.fun", "https://studynotion.fun", "https://www.studynotion.fun", "http://127.0.0.1:3000"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API"
    });
});
app.get("/gamearchive/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = req.params.id;
    try {
        const game = yield GameDb_1.default.findById({ _id: gameId });
        return res.status(200).json({
            success: true,
            moves: game.moves,
        });
    }
    catch (error) {
        console.log("game arch error", error);
        return res.status(400).json({
            success: false,
            message: `Please Fill up All the Required Fields`,
        });
    }
}));
app.get("/move/:id", urlencodedParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = req.params.id;
    try {
        const move = yield MoveDb_1.default.findById({ _id: gameId });
        return res.status(200).json({
            success: true,
            move,
        });
    }
    catch (error) {
        console.log("game arch error", error);
        return res.status(400).json({
            success: false,
            message: `Please Fill up All the Required Fields`,
        });
    }
}));
app.get("/gamehistory/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("reqqq");
    const email = req.params.id;
    console.log("email", email);
    try {
        const user = yield User_1.default.findOne({ email: email });
        // const gameAsWhite = user.gameAsWhite;
        // const gameAsBlack = user.gameAsBlack;
        console.log("uuuser", user === null || user === void 0 ? void 0 : user.gameAsBlack);
        const gameWhite = user === null || user === void 0 ? void 0 : user.gameAsBlack;
        const gameBlack = user === null || user === void 0 ? void 0 : user.gameAsWhite;
        return res.status(200).json({
            success: true,
            gameWhite,
            gameBlack
        });
    }
    catch (error) {
        console.log("game arch error", error);
        return res.status(400).json({
            success: false,
            message: `Please Fill up All the Required Fields`,
        });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
