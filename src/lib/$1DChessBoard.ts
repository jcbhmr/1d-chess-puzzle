import $1DChessPiece, { $1DChessPieceType, ChessColor } from "./$1DChessPiece";

export default class $1DChessBoard {
    grid: [($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null)]
    constructor(grid?: [($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null), ($1DChessPiece | null)]) {
        this.grid = grid ?? [new $1DChessPiece("white", "king"), new $1DChessPiece("white", "knight"), new $1DChessPiece("white", "rook"),  null, null, new $1DChessPiece("black", "rook"), new $1DChessPiece("black", "knight"), new $1DChessPiece("black", "king")]
    }

    createPiece(color: ChessColor, type: $1DChessPieceType) {
        return new $1DChessPiece(color, type, this)
    }
}