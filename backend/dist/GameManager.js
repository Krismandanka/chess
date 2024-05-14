"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const message_1 = require("./message");
class GameManager {
    constructor() {
        this.games = [];
        this.pendinguser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users.filter(user => user !== socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === message_1.INIT_GAME) {
                if (this.pendinguser) {
                    const game = new Game_1.Game(this.pendinguser, socket);
                    this.games.push(game);
                    this.pendinguser = null;
                    // console.log("hiiii");
                }
                else {
                    this.pendinguser = socket;
                    // console.log("tyyyyy");
                }
            }
            console.log("bbbbbbb");
            if (message.type === message_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("backend", message.payload);
                    game.makeMove(socket, message.payload);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
