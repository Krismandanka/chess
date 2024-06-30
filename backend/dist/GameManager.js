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
exports.GameManager = void 0;
const Game_1 = require("./Game");
const message_1 = require("./message");
const GameDb_1 = __importDefault(require("./models/GameDb"));
const User_1 = __importDefault(require("./models/User"));
class GameManager {
    constructor() {
        this.games = [];
        this.pendinguser = null;
        this.users = [];
        this.userName = "";
        this.emailP1 = "";
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users.filter(user => user !== socket);
    }
    addHandler(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            socket.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
                const message = JSON.parse(data.toString());
                if (message.type === message_1.INIT_GAME) {
                    if (this.pendinguser) {
                        const em1 = this.emailP1;
                        const em2 = message.email;
                        let u1;
                        let u2;
                        try {
                            console.log("sttttttttttttttt");
                            u1 = yield User_1.default.findOne({ email: em1 });
                            u2 = yield User_1.default.findOne({ email: em2 });
                            console.log("u1", u1);
                            if (!u1) {
                                console.log("user into create1");
                                u1 = yield User_1.default.create({ email: em1 });
                            }
                            if (!u2) {
                                console.log("user into create1");
                                u2 = yield User_1.default.create({ email: em2 });
                            }
                            console.log("user create");
                        }
                        catch (error) {
                            console.log("game eroor db", error);
                        }
                        const gameDb = yield GameDb_1.default.create({ whitePlayer: u1._id, blackPlayer: u2._id });
                        yield User_1.default.findByIdAndUpdate({
                            _id: u1._id,
                        }, {
                            $push: {
                                gameAsWhite: gameDb._id,
                            },
                        }, { new: true });
                        yield User_1.default.findByIdAndUpdate({
                            _id: u2._id,
                        }, {
                            $push: {
                                gameAsBlack: gameDb._id,
                            },
                        }, { new: true });
                        console.log("gamedb", gameDb);
                        console.log("idddd", gameDb._id);
                        let gId = gameDb._id;
                        const game = new Game_1.Game(this.pendinguser, socket, this.userName, message.name, this.emailP1, message.email, gId);
                        this.games.push(game);
                        this.pendinguser = null;
                        // console.log("hiiii");
                    }
                    else {
                        this.pendinguser = socket;
                        this.userName = message.name;
                        this.emailP1 = message.email;
                        // console.log("tyyyyy");
                    }
                }
                if (message.type === message_1.CHAT_MESSAGE) {
                    const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                    if (game) {
                        console.log("game finf fro message");
                        console.log("backend chat message", message.payload);
                        game.chatMessage(socket, message.payload.mess);
                    }
                }
                console.log("bbbbbbb", message);
                if (message.type === message_1.MOVE) {
                    const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                    if (game) {
                        console.log("backend", message.payload);
                        game.makeMove(socket, message.payload);
                    }
                }
            }));
        });
    }
}
exports.GameManager = GameManager;
