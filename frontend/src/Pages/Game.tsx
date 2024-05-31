// import React from 'react'
import ChessBoard from '../Components/ChessBoard'
import { useSocket } from '../hooks/useSocket'
import { GAME_OVER, INIT_GAME, MOVE } from '../Constants';
import { useEffect, useState, useRef } from 'react';
import { Chess } from 'chess.js';
import { movesAtom, userSelectedMoveIndexAtom } from '../atoms/chessBoard';
import { useUser } from "@clerk/clerk-react";


import { useRecoilValue, useSetRecoilState } from 'recoil';
import MovesTable from './MovesTable';
import { movesStore } from '../atoms/chessBoard';
import GameEndModal from '../Components/GameEndModal';




const Game = () => {


  const socket = useSocket();
  const { isSignedIn, user, isLoaded } = useUser();


  const [color, setColor] = useState<string | null>(null)
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [start, setStart] = useState(false)
  const [opponent, setOpponent] = useState<string | null>(null)
  const [winner, setWinner] = useState<string | null>(null);
  const [winModal, setWinModal] = useState(false);
  const [winName, setWinName] = useState<string | null>(null);

  const setMoves = useSetRecoilState(movesAtom);
  const setMov = useSetRecoilState(movesStore);
  const userSelectedMoveIndex = useRecoilValue(userSelectedMoveIndexAtom);
  const userSelectedMoveIndexRef = useRef(userSelectedMoveIndex);




  useEffect(() => {
    userSelectedMoveIndexRef.current = userSelectedMoveIndex;
  }, [userSelectedMoveIndex]);


  useEffect(() => {
    if (!socket) {
      return;
    }
    // console.log("socket",socket);
    // console.log("boar",board);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          // setChess(new Chess());
          setBoard(chess.board());
          setOpponent(message.payload.oppName);
          console.log("iniitgame", message.payload.color);
          setColor(message.payload.color);
          setStart(true);


          console.log("Game initialize");
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          if (userSelectedMoveIndexRef.current !== null) {
            setMoves((moves) => [...moves, move]);
            return;
          }
          setMov((moves) => [...moves, move]);
          setMoves((moves) => [...moves, move]);
          console.log("Move", move);
          break;
        case GAME_OVER:
          console.log("Game Over", message.payload.winner);

          setWinner(message.payload.winner)
          setWinName(message.payload.winName)
          setWinModal(true);
          break;
      }
    }

  }, [socket])

  if (!isLoaded) {
    // Handle loading state however you like
    return <div>Loading</div>;
  }


  if (!socket) {

    return <div>Connecting....</div>
  }
  return (
    <div className=''>
      {
        winModal && <GameEndModal win={winner === "white" ? "White" : "Black"} whitePlayer={color === "White" ? user?.fullName : opponent} blackPlayer={color === "White" ? opponent : user?.fullName} setWinModal={setWinModal} />
      }


      <div className='w-full min-h-screen bg-[#302E2B] relative justify-center py-4 px-3'>



        <div className='flex justify-center items-center gap-8'>
          <div className='flex flex-col'>
            <div>
              {user?.fullName}
              {color}


            </div>
            <div>
              {opponent}
              {color == "White" ? "Black" : "White"}

            </div>
          </div>

          <div className='justify-center items-center'>
            <ChessBoard color={color === "White" ? "w" : "b"} chess={chess} setBoard={setBoard} board={board} socket={socket} />
          </div>
          {
            !start && (
              <button className='text-white bg-[#5d9948] p-2 rounded-xl flex justify-between items-center gap-2' onClick={() => {
                socket.send(JSON.stringify({
                  type: INIT_GAME,
                  name: user?.fullName
                }));
                console.log("Socket send");
              }}>
                <img src="../../public/chessMove.webp" className='bg-[#5d9948]' alt="Logo" width={36} height={36} />
                <p className='text-2xl font-bold'>Play online</p>
              </button>

            )
          }
          <div>
            <MovesTable />

          </div>


        </div>

      </div>
    </div>
  )
}

export default Game