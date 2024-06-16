import { Game } from "./Game";
import { INIT_GAME, MOVE,TIME_OUT } from "./message";
import WebSocket from "ws";

export class GameManager{
    private games: Game[];
    pendinguser: WebSocket | null;
    private users: WebSocket[] ;
    userName:string ;



    constructor(){
        this.games = [];
        this.pendinguser = null;
        this.users = [];
        this.userName = "";
    }

    addUser(socket : WebSocket){
        this.users.push(socket);
        this.addHandler(socket);


    }

    removeUser (socket:WebSocket){
        this.users.filter(user => user !== socket);
    }


    private addHandler(socket :WebSocket){
        socket.on("message", (data:string) =>{
            const message = JSON.parse(data.toString());

            if(message.type ===INIT_GAME){
                if(this.pendinguser){
                    const game = new Game(this.pendinguser,socket,this.userName,message.name);
                    this.games.push(game);
                    this.pendinguser = null;
                    // console.log("hiiii");
                }
                else{
                    this.pendinguser = socket;
                    this.userName = message.name;

                    // console.log("tyyyyy");
                }
            }

            console.log("bbbbbbb",message)

            if(message.type ===MOVE){
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game){
                    console.log("backend",message.payload)
                    game.makeMove(socket,message.payload);
                }
            }
            
        })

        
    }


}

