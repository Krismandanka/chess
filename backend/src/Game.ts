import { Chess } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./message";
const GAME_TIME_MS = 20000;


export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public userName1: string;
  public userName2: string;
  private board: Chess;
  private moves: string[];
  private timer: NodeJS.Timeout | null = null;
  private moveTimer: NodeJS.Timeout | null = null;

  // private startTime:Date;
  private moveCount = 0;
  private player1TimeConsumed = 0;
  private player2TimeConsumed = 0;
  private startTime = new Date(Date.now());
  private lastMoveTime = new Date(Date.now());

  constructor(
    player1: WebSocket,
    player2: WebSocket,
    userName1: string,
    userName2: string,
    startTime?: Date
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.userName1 = userName1;
    this.userName2 = userName2;
    this.moves = [];
    if (startTime) {
      this.startTime = startTime;
      this.lastMoveTime = startTime;
    }
    // this.startTime = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "White",
          oppName: userName2,
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "Black",
          oppName: userName1,
        },
      })
    );
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    console.log("move ahhhhhhhhhhhhhhh", move);

    if (this.moveCount % 2 == 0 && socket !== this.player1) {
      console.log("earl y retun1 ");
      return;
    }
    if (this.moveCount % 2 == 1 && socket !== this.player2) {
      console.log("earl y retun2 ");
      console.log(this.moveCount % 2 == 1);
      console.log(socket !== this.player2);
      return;
    }
    const moveTimestamp = new Date(Date.now());

    if (this.board.turn() === "w") {
      this.player1TimeConsumed =
        this.player1TimeConsumed +
        (moveTimestamp.getTime() - this.lastMoveTime.getTime());
    }

    if (this.board.turn() === "b") {
      this.player2TimeConsumed =
        this.player2TimeConsumed +
        (moveTimestamp.getTime() - this.lastMoveTime.getTime());
    }
    this.resetAbandonTimer()
    this.resetMoveTimer();

    try {
      this.board.move(move);
    } catch (error) {
      console.log("move erroe", error);
      return;
    }

    if (this.board.isGameOver()) {
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
            winName:
              this.board.turn() === "w" ? this.userName2 : this.userName1,
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
            winName:
              this.board.turn() === "w" ? this.userName2 : this.userName1,
          },
        })
      );

      return;
    }
    this.lastMoveTime = moveTimestamp;

    this.player2.send(
      JSON.stringify({
        type: MOVE,

        payload: {
          move,
          player1TimeConsumed: this.player1TimeConsumed,
          player2TimeConsumed: this.player2TimeConsumed,
        },
      })
    );

    this.player1.send(
      JSON.stringify({
        type: MOVE,

        payload: {
          move,
          player1TimeConsumed: this.player1TimeConsumed,
          player2TimeConsumed: this.player2TimeConsumed,
        },
      })
    );

    this.moveCount++;
  }
  getPlayer1TimeConsumed() {
    if (this.board.turn() === 'w') {
      return this.player1TimeConsumed + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime());
    }
    return this.player1TimeConsumed;
  }

  getPlayer2TimeConsumed() {
    if (this.board.turn() === 'b') {
      return this.player2TimeConsumed + (new Date(Date.now()).getTime() - this.lastMoveTime.getTime());
    }
    return this.player2TimeConsumed;
  }

  async resetAbandonTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.endGame("ABANDONED", this.board.turn() === 'b' ? 'w' : 'b');
    }, 60 * 1000);
  }

  async resetMoveTimer() {
    if (this.moveTimer) {
      clearTimeout(this.moveTimer)
    }
    const turn = this.board.turn();
    const timeLeft = GAME_TIME_MS - (turn === 'w' ? this.player1TimeConsumed : this.player2TimeConsumed);

    this.moveTimer = setTimeout(() => {
      this.endGame("TIME_UP", turn === 'b' ? 'w' : 'b');
    }, timeLeft);
  }
  async endGame(status: string, result: string) {
    // const updatedGame = await db.game.update({
    //   data: {
    //     status,
    //     result: result,
    //   },
    //   where: {
    //     id: this.gameId,
    //   },
    //   include: {
    //     moves: {
    //       orderBy: {
    //         moveNumber: 'asc',
    //       },
    //     },
    //     blackPlayer: true,
    //     whitePlayer: true,
    //   }
    // });

    // SocketManager.getInstance().broadcast(
    //   this.gameId,
    //   JSON.stringify({
    //     type: GAME_ENDED,
    //     payload: {
    //       result,
    //       status,
    //       moves: updatedGame.moves,
    //       blackPlayer: {
    //         id: updatedGame.blackPlayer.id,
    //         name: updatedGame.blackPlayer.name,
    //       },
    //       whitePlayer: {
    //         id: updatedGame.whitePlayer.id,
    //         name: updatedGame.whitePlayer.name,
    //       },
    //     },
    //   }),
    // );
    // clear timers
    this.player1.send(
        JSON.stringify({
          type: status,
          payload: {
            winner: result === "w" ? "black" : "white",
            winName:
              result === "w" ? this.userName2 : this.userName1,
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: status,
          payload: {
            winner: result === "w" ? "black" : "white",
            winName:
              result === "w" ? this.userName2 : this.userName1,
          },
        })
      );
    this.clearTimer();
    this.clearMoveTimer();
  }




  clearMoveTimer() {
    if(this.moveTimer) clearTimeout(this.moveTimer);
  }

  setTimer(timer: NodeJS.Timeout) {
    this.timer = timer;
  }

  clearTimer() {
    if (this.timer) clearTimeout(this.timer);
  }

}
