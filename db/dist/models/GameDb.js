"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// import { Move } from "chess.js";
const GameSchema = new mongoose_1.Schema({
    player1: {
        type: String,
        require: true
    },
    player2: {
        type: String,
        require: true
    },
    whitePlayer: {
        type: mongoose_1.default.Types.ObjectId,
        require: true,
        ref: "User"
    },
    blackPlayer: {
        type: mongoose_1.default.Types.ObjectId,
        require: true,
        ref: "User"
    },
    result: {
        type: String,
        enum: ["WhiteWin", "BlackWin", "Draw"]
    },
    startingFen: {
        type: String,
        default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    },
    moves: [{
            type: mongoose_1.default.Types.ObjectId,
            ref: "MoveDb"
        }]
}, { timestamps: true });
const GameDb = (0, mongoose_1.model)("GameDb", GameSchema);
exports.default = GameDb;
