// import React from 'react'
import { Color, PieceSymbol, Square, Move } from "chess.js";
import { useState, useEffect } from "react";
import { MOVE } from "../Constants";
import { useSetRecoilState, useRecoilState } from "recoil";
import { movesAtom, userSelectedMoveIndexAtom } from "../atoms/chessBoard";
import { movesStore } from "../atoms/chessBoard";
const ChessBoard = ({
  chess,
  board,
  socket,
  setBoard,
  color,
  isArch
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket | null;
  setBoard: any;
  chess: any;
  color: string | null;
  isArch: boolean
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null,
  );

  console.log("vvvvvvvvvvvvvvvvvvvvvvvv", color)

  // const setMov = useSetRecoilState(movesStore)
  // const setMoves = useSetRecoilState(movesAtom);
  const [moves, setMoves] = useRecoilState(movesAtom);
  const [userSelectedMoveIndex, setUserSelectedMoveIndex] = useRecoilState(
    userSelectedMoveIndexAtom,
  );

  // const [toMove, setTo] = useState<null | Square>(null)
  useEffect(() => {
    if (userSelectedMoveIndex !== null) {
      // console.log("huiiiiiiiiiiii", userSelectedMoveIndex),
      // console.log("mobbb", moves);
      const move = moves[userSelectedMoveIndex];
      // console.log("mmm", move)
      setLastMove({
        from: move.from,
        to: move.to,
      });
      // console.log("lsat   workk")
      try {
        chess.load(move.after);
      } catch (e) {
        // console.log("move rrr", e)
      }
      chess.load(move.after);
      console.log("new board", chess.board());
      setBoard(chess.board());
      return;
    }
  }, [userSelectedMoveIndex]);

  useEffect(() => {
    if (userSelectedMoveIndex !== null) {
      chess.reset();
      moves.forEach((move) => {
        chess.move({ from: move.from, to: move.to });
      });
      setBoard(chess.board());
      setUserSelectedMoveIndex(null);
    } else {
      setBoard(chess.board());
    }
  }, [moves]);

  // console.log("Board", board);
  return (
    <div className="justify-center items-center ">
      {board.map((row, i) => {
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
      })}
    </div>
  );
};

export default ChessBoard;
