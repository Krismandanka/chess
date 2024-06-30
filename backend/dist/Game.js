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
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
// import {GameDb} from "../../db/src/models/GameDb";
// const GameDb = require("../../db/src/models/GameDb");
// const User = require("../../db/src/models/User");
const GameDb_1 = __importDefault(require("./models/GameDb"));
const MoveDb_1 = __importDefault(require("./models/MoveDb"));
const GAME_TIME_MS = 200000;
class Game {
    constructor(player1, player2, userName1, userName2, email1, email2, gameId, startTime) {
        this.timer = null;
        this.moveTimer = null;
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
        this.startTime = new Date();
        this.gameId = gameId;
        // const gameDb = this.gameDbAdd(email1,email2);
        // this.gameId = gameDb.id;
        console.log("gameidin classssssss", this.gameId);
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "White",
                oppName: userName2,
            },
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "Black",
                oppName: userName1,
            },
        }));
    }
    GameFind() {
        return __awaiter(this, void 0, void 0, function* () {
            let gg = yield GameDb_1.default.findById({ _id: this.gameId });
            console.log("ggg", gg);
        });
    }
    chatMessage(socket, mess) {
        const colorMess = socket === this.player1 ? "White" : "Black";
        console.log("in chtMESSAGE APP color", colorMess);
        this.player1.send(JSON.stringify({
            type: message_1.CHAT_MESSAGE,
            payload: {
                colorMess,
                mess
            },
        }));
        this.player2.send(JSON.stringify({
            type: message_1.CHAT_MESSAGE,
            payload: {
                colorMess,
                mess
            },
        }));
    }
    // async gameDbAdd(email1:string,email2:string){
    //   let u1:any = await User.find({email1});
    //   let u2:any= await User.find({email2});
    //   if(!u1){
    //     u1 = await User.create({email1});
    //   }
    //   if(!u2){
    //     u2 = await User.create({email2});
    //   }
    //   const game = await GameDb.create({whitePlayer:u1._id,blackPlayer:u2._id});
    //   return game;
    // }
    addMoveToDb(move) {
        return __awaiter(this, void 0, void 0, function* () {
            let moveInDb = yield MoveDb_1.default.create(move);
            yield GameDb_1.default.findByIdAndUpdate({
                _id: this.gameId
            }, {
                $push: {
                    moves: moveInDb._id,
                },
            }, { new: true });
        });
    }
    makeMove(socket, move) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("move ahhhhhhhhhhhhhhh", move);
            this.GameFind();
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
            if (this.board.turn() === "w") {
                this.player1TimeConsumed =
                    this.player1TimeConsumed +
                        (moveTimestamp.getTime() - this.lastMoveTime.getTime());
            }
            if (this.board.turn() === "b") {
                this.player2TimeConsumed =
                    this.player2TimeConsumed +
                        (moveTimestamp.getTime() - this.lastMoveTime.getTime());
            }
            this.resetAbandonTimer();
            this.resetMoveTimer();
            try {
                let moDb = this.board.move(move);
                this.addMoveToDb(moDb);
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
                        winName: this.board.turn() === "w" ? this.userName2 : this.userName1,
                    },
                }));
                this.player2.send(JSON.stringify({
                    type: message_1.GAME_OVER,
                    payload: {
                        winner: this.board.turn() === "w" ? "black" : "white",
                        winName: this.board.turn() === "w" ? this.userName2 : this.userName1,
                    },
                }));
                let winDb = this.board.turn() === "w" ? "BlackWin" : "WhiteWin";
                yield GameDb_1.default.findByIdAndUpdate({
                    _id: this.gameId
                }, {
                    result: winDb
                }, { new: true });
                return;
            }
            this.lastMoveTime = moveTimestamp;
            this.player2.send(JSON.stringify({
                type: message_1.MOVE,
                payload: {
                    move,
                    player1TimeConsumed: this.player1TimeConsumed,
                    player2TimeConsumed: this.player2TimeConsumed,
                },
            }));
            this.player1.send(JSON.stringify({
                type: message_1.MOVE,
                payload: {
                    move,
                    player1TimeConsumed: this.player1TimeConsumed,
                    player2TimeConsumed: this.player2TimeConsumed,
                },
            }));
            this.moveCount++;
        });
    }
    getPlayer1TimeConsumed() {
        if (this.board.turn() === 'w') {
            return this.player1TimeConsumed + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime());
        }
        return this.player1TimeConsumed;
    }
    getPlayer2TimeConsumed() {
        if (this.board.turn() === 'b') {
            return this.player2TimeConsumed + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime());
        }
        return this.player2TimeConsumed;
    }
    resetAbandonTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.endGame("ABANDONED", this.board.turn() === 'b' ? 'w' : 'b');
            }, 60 * 1000);
        });
    }
    resetMoveTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.moveTimer) {
                clearTimeout(this.moveTimer);
            }
            const turn = this.board.turn();
            const timeLeft = GAME_TIME_MS - (turn === 'w' ? this.player1TimeConsumed : this.player2TimeConsumed);
            this.moveTimer = setTimeout(() => {
                this.endGame("TIME_UP", turn === 'b' ? 'w' : 'b');
            }, timeLeft);
        });
    }
    endGame(status, result) {
        return __awaiter(this, void 0, void 0, function* () {
            // const updatedGame = await db.game.update({
            //   data: {
            //     status,
            //     result: result,
            //   },
            //   where: {
            //     id: this.gameId,
            //   },
            //   include: {
            //     moves: {
            //       orderBy: {
            //         moveNumber: 'asc',
            //       },
            //     },
            //     blackPlayer: true,
            //     whitePlayer: true,
            //   }
            // });
            // SocketManager.getInstance().broadcast(
            //   this.gameId,
            //   JSON.stringify({
            //     type: GAME_ENDED,
            //     payload: {
            //       result,
            //       status,
            //       moves: updatedGame.moves,
            //       blackPlayer: {
            //         id: updatedGame.blackPlayer.id,
            //         name: updatedGame.blackPlayer.name,
            //       },
            //       whitePlayer: {
            //         id: updatedGame.whitePlayer.id,
            //         name: updatedGame.whitePlayer.name,
            //       },
            //     },
            //   }),
            // );
            // clear timers
            this.player1.send(JSON.stringify({
                type: status,
                payload: {
                    winner: result === "w" ? "black" : "white",
                    winName: result === "w" ? this.userName2 : this.userName1,
                },
            }));
            this.player2.send(JSON.stringify({
                type: status,
                payload: {
                    winner: result === "w" ? "black" : "white",
                    winName: result === "w" ? this.userName2 : this.userName1,
                },
            }));
            this.clearTimer();
            this.clearMoveTimer();
        });
    }
    clearMoveTimer() {
        if (this.moveTimer)
            clearTimeout(this.moveTimer);
    }
    setTimer(timer) {
        this.timer = timer;
    }
    clearTimer() {
        if (this.timer)
            clearTimeout(this.timer);
    }
}
exports.Game = Game;
