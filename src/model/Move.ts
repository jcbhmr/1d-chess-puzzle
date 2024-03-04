import { Position } from "./Piece.ts";

export default interface Move {
    start: Position
    end: Position
}