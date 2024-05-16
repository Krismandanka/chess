// import React from 'react'
import ChessBoard from '../Components/ChessBoard'
import { useSocket } from '../hooks/useSocket'
import { GAME_OVER, INIT_GAME, MOVE } from '../Constants';
import { useEffect ,useState} from 'react';
import { Chess } from 'chess.js';

const Game = () => {


  const socket = useSocket();
  const [color, setColor] = useState<string | null>(null)
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());


    useEffect(() => {
      if(!socket){
        return;
      }
      // console.log("socket",socket);
      // console.log("boar",board);
      socket.onmessage=(event)=>{
        const message = JSON.parse(event.data);
        console.log(message);
        switch (message.type) {
          case INIT_GAME:
            // setChess(new Chess());
            setBoard(chess.board());
            console.log("iniitgame",message.payload.color);
            setColor(message.payload.color);


            console.log("Game initialize");``
            break;
          case MOVE:
            const move =message.payload;
            chess.move(move);
            setBoard(chess.board());
            console.log("Move",move);
            break;
          case GAME_OVER:
            console.log("Game Over");
            break;
        }
      }
      
    }, [socket])
    

  if(!socket){

    return <div>Connecting....</div>
  }
  return (
    <div className='w-full min-h-screen bg-[#302E2B] relative justify-center py-4 px-3'>
      <div className='flex justify-center items-center gap-8'>

        <div className='justify-center items-center'>
          <ChessBoard color={color} chess={chess} setBoard={setBoard} board={board}  socket={socket}/>
        </div>
        <button className='text-white bg-[#5d9948] p-2 rounded-xl flex justify-between items-center gap-2' onClick={()=>{
          socket.send(JSON.stringify({
            type:INIT_GAME
          }));
          console.log("Socket send");
        }}>
          <img src="../../public/chessMove.webp" className='bg-[#5d9948]' alt="Logo" width={36} height={36} />
          <p className='text-2xl font-bold'>Play online</p>
        </button>

      </div>
      
    </div>
  )
}

export default Game