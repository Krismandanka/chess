// import React from 'react'
import { Color,PieceSymbol,Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../Constants";
const ChessBoard = ({chess,board,socket,setBoard,color}:{board:
  ({
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null)[][];
  socket:WebSocket;
  setBoard:any;
  chess:any;
  color:string |null
  

}) => {

  const [from, setFrom] = useState<null | Square>(null);
  // const [toMove, setTo] = useState<null | Square>(null)

  console.log("Board",board);
  return (
    <div className="justify-center items-center ">
      {board.map((row,i)=>{
        return <div key={i} className="flex transition duration-1000">
          {
            row.map((square,j)=>{
              
              const squareRepresent = String.fromCharCode(97+(j%8))+""+(8-i) as Square;
              return <div key={j} className={`w-16 h-16 rounded-[1px] ${(i+j)%2===0 ? 'bg-[#769656]':'bg-[#eeeed2]'}`}
                onClick={()=>{
                  if(!from){
                    if(square && square.color!==color){
                      return;
                    }

                    console.log("from ",squareRepresent);
                    setFrom(squareRepresent);
                  }
                  else{

                    if(square){
                      setFrom(squareRepresent);
                      return;

                    }
                    

                   
                    socket.send(JSON.stringify({
                      type:MOVE,
                      payload:{
                        from,
                        to:squareRepresent
                      }
                    }))
                    // board.move()
                    try {
                      
                      
                      chess.move({
                        from,
                          to:squareRepresent
                      })
                      
                    } catch (error) {
                      setFrom(null);
                      console.log("move front end error");

                      return;
                    }
                   
                    setBoard(chess.board());
                    setFrom(null);
                  }
                }}
              >

                <div className="w-full justify-center flex h-full">
                  <div className="h-full justify-center flex flex-col ">
                  {
                    square ? <img src={`https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${square?.color==='b'?`b${square.type}`:`w${square.type}`}.png`} alt="Pieces" />:null
                  }

                  </div>

                </div>
                

              </div>
            })
          }

        </div>
      })}
      

    </div>
  )
}

export default ChessBoard