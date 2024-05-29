import { Move, Square } from 'chess.js';
import { atom } from "recoil";

export const isBoardFlippedAtom = atom({
    key: "isBoardFlippedAtom",
    default: false,
})

export const movesAtom = atom<Move[]>({
    key: "movesAtom",
    default: []
})


export const movesStore = atom<{from:Square,to:Square}[]>({
    key: "movesStore",
    default: []
})

export const userSelectedMoveIndexAtom = atom<number | null>({
    key: 'userSelectedMoveIndex',
    default: null
});




