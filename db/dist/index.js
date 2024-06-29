"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express from "express"
const express_1 = __importDefault(require("express"));
// const express=require('express');
const app = (0, express_1.default)();
// const database=require('./config/database');
const database_1 = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
// database.connect();
(0, database_1.dbConnect)();
app.use(express_1.default.json());
app.use(cookieParser());
app.use(cors({
    origin: ["https://study-notion-eta.vercel.app", "http://localhost:3000", "www.studynotion.fun", "studynotion.fun", "https://studynotion.fun", "https://www.studynotion.fun", "http://127.0.0.1:3000"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API"
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
