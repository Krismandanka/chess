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
    // private startTime:Date;
    private moveCount=0;
    private player1TimeConsumed = 0;
    private player2TimeConsumed = 0;
    private startTime = new Date(Date.now());
    private lastMoveTime = new Date(Date.now());

    constructor(player1:WebSocket,player2: WebSocket,userName1:string,userName2:string, startTime?: Date){
        this.player1 = player1;
        this.player2 = player2;
        this.board =new Chess();
        this.userName1=userName1;
        this.userName2 = userName2;
        this.moves=[];
        if (startTime) {
            this.startTime = startTime;
            this.lastMoveTime = startTime;
          }
        // this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"White",
                oppName:userName2
            }
        }))

        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"Black",
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
        const moveTimestamp = new Date(Date.now());



        if (this.board.turn() === 'b') {
            this.player1TimeConsumed = this.player1TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime());
          }
      
          if (this.board.turn() === 'w') {
            this.player2TimeConsumed = this.player2TimeConsumed + (moveTimestamp.getTime() - this.lastMoveTime.getTime());
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
                    winner :this.board.turn() === "w" ?"black":"white",
                    winName:this.board.turn() === "w" ?this.userName2:this.userName1
                }

            }))
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner :this.board.turn() === "w" ?"black":"white",
                    winName:this.board.turn() === "w" ?this.userName2:this.userName1
                }

            }))

            return;
        }
        this.lastMoveTime = moveTimestamp;


        
            this.player2.send(JSON.stringify({
                type:MOVE,
                
                payload: { move, player1TimeConsumed: this.player1TimeConsumed, player2TimeConsumed: this.player2TimeConsumed }        
            }))
        
        
            this.player1.send(JSON.stringify({
                type:MOVE,
                
                payload: { move, player1TimeConsumed: this.player1TimeConsumed, player2TimeConsumed: this.player2TimeConsumed }          

            }))
        
        
        this.moveCount++;




    }


}