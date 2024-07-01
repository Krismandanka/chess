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
    const socket = useSocket();
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
        <div className="justify-center items-center ">
            {/* {
                movArch.length > 0 && movArch.map((move: any, index) => {
                    console.log("moves in ", move);
                    return (
                        <div key={index}>
                            {move.san}
                        </div>
                    )
                })
            } */}
            {/* {board.map((row, i) => {
                return (
                    <div key={i} className="flex transition duration-1000">
                        {row.map((square, j) => {
                            const squareRepresent = (String.fromCharCode(97 + (j % 8)) +
                                "" +
                                (8 - i)) as Square;
                            return (
                                <div
                                    key={j}
                                    className={`w-16 h-16 rounded-[1px] ${(i + j) % 2 === 0 ? "bg-[#769656]" : "bg-[#eeeed2]"
                                        }`}

                                >
                                    <div className="w-full justify-center flex h-full">
                                        <div className={`h-full justify-center flex flex-col `}>
                                            {square ? (
                                                <img

                                                    src={`https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${square?.color === "b"
                                                        ? `b${square.type}`
                                                        : `w${square.type}`
                                                        }.png`}
                                                    alt="Pieces"
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })} */}
            <div className={`justify-center items-center `}>
                <ChessBoard color={"b"} chess={chess} setBoard={setBoard} board={board} socket={socket} isArch={false} />
            </div>
            <div>
                {
                    movArch.length > 0 && <MovesTable />
                }
            </div>


        </div>
    )
}

export default PreGame