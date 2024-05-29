import { Chess } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./message";

export class Game{
    
    public player1:WebSocket;
    public player2: WebSocket;
    public userName1:string;
    public userName2: string;
    private board:Chess;
    private moves: string[];
    private startTime:Date;
    private moveCount=0;

    constructor(player1:WebSocket,player2: WebSocket,userName1:string,userName2:string){
        this.player1 = player1;
        this.player2 = player2;
        this.board =new Chess();
        this.userName1=userName1;
        this.userName2 = userName2;
        this.moves=[];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"w",
                oppName:userName2
            }
        }))

        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"b",
                oppName:userName1
            }
        }))



    }

    makeMove(socket:WebSocket,move:{
        from:string,
        to:string
    }){

        if (this.moveCount %2 ==0 && socket !== this.player1) {
            console.log("earl y retun1 ");
            return;
        }
        if (this.moveCount %2 ==1 && socket !== this.player2) {
            console.log("earl y retun2 ");
            console.log(this.moveCount %2 ==1);
            console.log(socket !== this.player2)


            return;
        }



        try {
            this.board.move(move);
            
        
        } catch (error) {
            console.log("move erroe",error);
            return;
            
        }

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner :this.board.turn() === "w" ?"black":"white"
                }

            }))

            return;
        }

        if(this.moveCount%2===0){
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:move

            }))
        }
        else{
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move

            }))
        }
        this.moveCount++;




    }


}