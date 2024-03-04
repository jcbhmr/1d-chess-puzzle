import Piece, { Color, Type } from "./Piece.ts";

export default class Board {
    line: (Piece | null)[] = [null, null, null, null, null, null, null, null]
    constructor() {

    }

    createPiece(color: Color, type: Type, position)
}