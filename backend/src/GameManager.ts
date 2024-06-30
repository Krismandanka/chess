import { Game } from "./Game";
import { CHAT_MESSAGE, INIT_GAME, MOVE,TIME_OUT } from "./message";
import WebSocket from "ws";
import GameDb from "./models/GameDb";
import User from "./models/User";
import MoveDb from "./models/MoveDb";
export class GameManager{
    private games: Game[];
    pendinguser: WebSocket | null;
    private users: WebSocket[] ;
    userName:string ;
    emailP1:string;



    constructor(){
        this.games = [];
        this.pendinguser = null;
        this.users = [];
        this.userName = "";
        this.emailP1="";
    }

    addUser(socket : WebSocket){
        this.users.push(socket);
        this.addHandler(socket);


    }

    removeUser (socket:WebSocket){
        this.users.filter(user => user !== socket);
    }


    private async  addHandler(socket :WebSocket){
        socket.on("message", async (data:string) =>{
            const message = JSON.parse(data.toString());

            if(message.type ===INIT_GAME){
                if(this.pendinguser){
                    const em1= this.emailP1;
                    const em2= message.email;
                    let u1:any;
                    let u2:any;
                    try {
                        console.log("sttttttttttttttt");
                        u1 = await User.findOne({email:em1});
                        u2= await User.findOne({email:em2});
                        console.log("u1",u1);
                        if(!u1){
                            console.log("user into create1")
                            u1 = await User.create({email:em1});
                        }
                        if(!u2){
                            console.log("user into create1")

                            u2 = await User.create({email:em2});
                        }
                        console.log("user create");
                            
                    } catch (error) {
                        console.log("game eroor db",error);
                    }

                    
                    const gameDb  = await GameDb.create({whitePlayer:u1._id,blackPlayer:u2._id});

                    await User.findByIdAndUpdate(
                        {
                          _id: u1._id,
                        },
                        {
                          $push: {
                            gameAsWhite: gameDb._id,
                          },
                        },
                        { new: true }
                      )
                    
                      await User.findByIdAndUpdate(
                        {
                          _id: u2._id,
                        },
                        {
                          $push: {
                            gameAsBlack: gameDb._id,
                          },
                        },
                        { new: true }
                      )

                    console.log("gamedb",gameDb);
                    console.log("idddd",gameDb._id);
                    let gId:any =gameDb._id


                    
                    const game = new Game(this.pendinguser,socket,this.userName,message.name,this.emailP1,message.email,gId);
                    this.games.push(game);
                    this.pendinguser = null;
                    // console.log("hiiii");
                }
                else{
                    this.pendinguser = socket;
                    this.userName = message.name;
                    this.emailP1 = message.email;

                    // console.log("tyyyyy");
                }
            }
            if(message.type ===CHAT_MESSAGE){
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game){
                    console.log("game finf fro message")
                    console.log("backend chat message",message.payload)
                    game.chatMessage(socket,message.payload.mess)
                    
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

