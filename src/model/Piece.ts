import Board from "./Board.ts";

export type Color = "white" | "black"
export type Type = "king" | "knight" | "rook"
export type Position = number

export default class Piece {
    color: Color
    type: Type
    position: Position
    board: Board
    constructor(color: Color, type: Type, position: Position, board: Board) {
        this.color = color
        this.type = type
        this.position = position
        this.board = board
    }
}