// import React from 'react'
import ChessBoard from '../Components/ChessBoard'
import { useSocket } from '../hooks/useSocket'
import { GAME_OVER, INIT_GAME, MOVE, TIME_UP, ABANDONED, CHAT_MESSAGE } from '../Constants';
import { useEffect, useState, useRef } from 'react';
import { Chess, Move } from 'chess.js';
import { movesAtom, userSelectedMoveIndexAtom } from '../atoms/chessBoard';
import { useUser } from "@clerk/clerk-react";

import { useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import MovesTable from './MovesTable';
import { movesStore } from '../atoms/chessBoard';
import GameEndModal from '../Components/GameEndModal';
import Chat from '../Components/Chat';

// interface chatMess {

// }

interface IResult {


  isOpp: boolean;
  message: string;


}

const Game = () => {


  const socket = useSocket();
  const { isSignedIn, user, isLoaded } = useUser();
  // const { gameId } = useParams();
  console.log("gameif", user?.emailAddresses[0].emailAddress);


  const [color, setColor] = useState<string | null>(null)
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [start, setStart] = useState(false)
  const [opponent, setOpponent] = useState<string | null>(null)
  const [winner, setWinner] = useState<string | null>(null);
  const [winModal, setWinModal] = useState(false);
  const [winName, setWinName] = useState<string | null>(null);
  const [player1TimeConsumed, setPlayer1TimeConsumed] = useState(0);
  const [player2TimeConsumed, setPlayer2TimeConsumed] = useState(0);
  const [chatMessages, setChatMessages] = useState<IResult[]>([]);

  const setMoves = useSetRecoilState(movesAtom);
  // const setMov = useSetRecoilState(movesStore);
  const userSelectedMoveIndex = useRecoilValue(userSelectedMoveIndexAtom);
  const userSelectedMoveIndexRef = useRef(userSelectedMoveIndex);

  console.log("color1", color);


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
          // const move = message.payload;
          const { move, player1TimeConsumed, player2TimeConsumed } =
            message.payload;
          let moveResult: Move;
          setPlayer1TimeConsumed(player1TimeConsumed);
          setPlayer2TimeConsumed(player2TimeConsumed);
          if (userSelectedMoveIndexRef.current !== null) {
            setMoves((moves) => [...moves, move]);
            return;
          }
          moveResult = chess.move(move);
          setBoard(chess.board());
          // if (userSelectedMoveIndexRef.current !== null) {
          //   setMoves((moves) => [...moves, move]);
          //   return;
          // }
          // setMov((moves) => [...moves, move]);
          setMoves((moves) => [...moves, moveResult]);
          console.log("Move", move);
          break;
        case GAME_OVER:
          console.log("Game Over", message.payload.winner);

          setWinner(message.payload.winner)
          setWinName(message.payload.winName)
          setWinModal(true);
          break;
        case TIME_UP:
          console.log("Game Over", message.payload.winner);

          setWinner(message.payload.winner)
          setWinName(message.payload.winName)
          setWinModal(true);
          break;
        case ABANDONED:
          console.log("Game Over", message.payload.winner);

          setWinner(message.payload.winner)
          setWinName(message.payload.winName)
          setWinModal(true);
          break;
        case CHAT_MESSAGE:
          const mess = message.payload.mess;
          const colorMess = message.payload.colorMess;
          // console.log("messs", mess)
          console.log("coo", colorMess);
          console.log("color", opponent)
          // console.log("CHat message in fronend ", message.payload);
          if (color === colorMess) {
            const chatCompo = {
              isOpp: true,
              message: mess

            }
            setChatMessages((chat: IResult[]) => [...chat, chatCompo])
            // setMyArray(oldArray => [...oldArray, newElement]);
            // 
          }
          else {
            const chatCompo = {
              isOpp: false,
              message: mess

            }
            setChatMessages((chat: IResult[]) => [...chat, chatCompo])
            console.log("onnnnnnnnnnnnnnnnn", chatMessages);
          }


          break;
      }
    }

  }, [socket])

  // useEffect(() => {
  //   if (start) {
  //     const interval = setInterval(() => {
  //       if (chess.turn() === 'w') {
  //         setPlayer1TimeConsumed((p) => p + 100);


  //       } else {
  //         setPlayer2TimeConsumed((p) => p + 100);

  //       }
  //     }, 100);
  //     return () => clearInterval(interval);
  //   }
  // }, [start]);
  const getTimer = (timeConsumed: number) => {
    const timeLeftMs = 200000 - timeConsumed;


    const minutes = Math.floor(timeLeftMs / (1000 * 60));
    const remainingSeconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

    return (
      <div className="text-white">
        Time Left: {minutes < 10 ? '0' : ''}
        {minutes}:{remainingSeconds < 10 ? '0' : ''}
        {remainingSeconds}
      </div>
    );
  };


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
              {
                getTimer(color === "White" ? player1TimeConsumed : player2TimeConsumed)
              }


            </div>
            <div>
              {opponent}
              {color == "White" ? "Black" : "White"}
              {getTimer(color === "White" ? player2TimeConsumed : player1TimeConsumed)}

            </div>
          </div>

          <div className={`justify-center items-center `}>
            <ChessBoard color={color === "White" ? "w" : "b"} chess={chess} setBoard={setBoard} board={board} socket={socket} />
          </div>
          {
            !start && (
              <button className='text-white bg-[#5d9948] p-2 rounded-xl flex justify-between items-center gap-2' onClick={() => {
                socket.send(JSON.stringify({
                  type: INIT_GAME,
                  name: user?.fullName,
                  email: user?.emailAddresses[0].emailAddress
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
      <Chat socket={socket} chatMessages={chatMessages} />
    </div>
  )
}

export default Game