import $1DChessBoard from "./$1DChessBoard"

export default class $1DChessPiece {
    color: ChessColor
    type: $1DChessPieceType
    board: $1DChessBoard | null
    constructor(color: ChessColor, type: $1DChessPieceType, board: $1DChessBoard | null = null) {
        this.color = color
        this.type = type
        this.board = board
    }

    get isConnected() {
        return !!this.board
    }

    getPossibleMoves() {
        if (this.type === "king") {
            
        } else if (this.type === "knight") {

        } else if (this.type === "rook") {

        } else throw new Error("unreachable")
    }
}

export type ChessColor = "white" | "black"
export type $1DChessPieceType = "king" | "knight" | "rook"