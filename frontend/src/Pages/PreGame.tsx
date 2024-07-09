import React from 'react'
import { Color, PieceSymbol, Square } from "chess.js";
import { Chess, Move } from 'chess.js';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { movesAtom, userSelectedMoveIndexAtom } from '../atoms/chessBoard';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovesTable from './MovesTable';
import ChessBoard from '../Components/ChessBoard';
import { useSocket } from '../hooks/useSocket';
const PreGame = () => {
    const socket:WebSocket|null = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const { gameId } = useParams();
    const [movArch, setMovArch] = useState<Move[]>([]);
    // const [movesArray, setMovesArray] = useState<any>(null);

    const setMoves = useSetRecoilState(movesAtom);
    // const setMov = useSetRecoilState(movesStore);
    const userSelectedMoveIndex = useRecoilValue(userSelectedMoveIndexAtom);
    const userSelectedMoveIndexRef = useRef(userSelectedMoveIndex);

    //   console.log("color1", color);


    useEffect(() => {
        userSelectedMoveIndexRef.current = userSelectedMoveIndex;
    }, [userSelectedMoveIndex]);
    useEffect(() => {
        moveApi();

    }, [])

    const moveApi = async () => {
        const moves = await axios(`http://localhost:4000/gamearchive/${gameId}`);
        console.log(",oves form archie gammmmmm", moves.data.moves);
        let b = new Array(moves.data.moves.length);

        for (let i = 0; i < moves.data.moves.length; i++) {
            let mm = await axios(`http://localhost:4000/move/${moves.data.moves[i]}`)
            delete mm.data.move._id;
            delete mm.data.move.createdAt;
            delete mm.data.move.updatedAt
            delete mm.data.move.__v

            b[i] = mm.data.move;

            console.log(`mm ${i}`, mm.data.move)
        }

        // const movesArr = b.reduce((result, _, index: number, array: Move[]) => {
        //     if (index % 2 === 0) {
        //         result.push(array.slice(index, index + 2));
        //     }
        //     return result;
        // }, [] as Move[][]);
        // setMovesArray(movesArr);

        setMovArch(b);
        setMoves(b);


    }

    



    return (
        
      


      <div className='w-full min-h-screen bg-[#302E2B] relative justify-center py-4 px-3'>



        <div className='flex justify-center items-center gap-8'>
          

          <div className={`justify-center items-center `}>
          <ChessBoard color={"b"} chess={chess} setBoard={setBoard} board={board} socket={socket} isArch={false} />
          </div>
          
          <div>
                {
                    movArch.length > 0 && <MovesTable />
                }

          </div>


        </div>

      </div>
      
    
        
    )
}

export default PreGame


// <div className="justify-center items-center ">
            
//             <div className={`justify-center items-center `}>
//                 <ChessBoard color={"b"} chess={chess} setBoard={setBoard} board={board} socket={socket} isArch={false} />
//             </div>
//             <div>
//                 
//             </div>


//         </div>