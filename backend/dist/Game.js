"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2, userName1, userName2, startTime) {
        // private startTime:Date;
        this.moveCount = 0;
        this.player1TimeConsumed = 0;
        this.player2TimeConsumed = 0;
        this.startTime = new Date(Date.now());
        this.lastMoveTime = new Date(Date.now());
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.userName1 = userName1;
        this.userName2 = userName2;
        this.moves = [];
        if (startTime) {
            this.startTime = startTime;
            this.lastMoveTime = startTime;
        }
        // this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "White",
                oppName: userName2
            }
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "Black",
                oppName: userName1
            }
        }));
    }
    makeMove(socket, move) {
        if (this.moveCount % 2 == 0 && socket !== this.player1) {
            console.log("earl y retun1 ");
            return;
        }
        if (this.moveCount % 2 == 1 && socket !== this.player2) {
            console.log("earl y retun2 ");
            console.log(this.moveCount % 2 == 1);
            console.log(socket !== this.player2);
            return;
        }
        const moveTimestamp = new Date(Date.now());
        if (this.board.turn() === 'b') {
            this.player1TimeConsumed = this.player1TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime());
        }
        if (this.board.turn() === 'w') {
            this.player2TimeConsumed = this.player2TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime());
        }
        try {
            this.board.move(move);
        }
        catch (error) {
            console.log("move erroe", error);
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                    winName: this.board.turn() === "w" ? this.userName2 : this.userName1
                }
            }));
            this.player2.send(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                    winName: this.board.turn() === "w" ? this.userName2 : this.userName1
                }
            }));
            return;
        }
        this.lastMoveTime = moveTimestamp;
        this.player2.send(JSON.stringify({
            type: message_1.MOVE,
            payload: { move, player1TimeConsumed: this.player1TimeConsumed, player2TimeConsumed: this.player2TimeConsumed }
        }));
        this.player1.send(JSON.stringify({
            type: message_1.MOVE,
            payload: { move, player1TimeConsumed: this.player1TimeConsumed, player2TimeConsumed: this.player2TimeConsumed }
        }));
        this.moveCount++;
    }
}
exports.Game = Game;
