export class Game {}

export class Board extends EventTarget {
    line: (Piece | null)[] = [
        this.createPiece("white", "king"),
        this.createPiece("white", "knight"),
        this.createPiece("white", "rook"),
        null,
        null,
        this.createPiece("black", "king"),
        this.createPiece("black", "knight"),
        this.createPiece("black", "rook"),
    ]

    createPiece(color: Color, type: Type) {
        return new Piece(color, type, this)
    }

    positionOf(piece: Piece): Position | null {
        const i = this.line.indexOf(piece)
        if (i === -1) {
            return null
        } else {
            return new Position(i + 1)
        }
    }

    setPosition(pos: Position, piece: Piece) {
        const removed = this.line[pos.index]
        this.line[pos.index] = piece
        if (removed) {
            removed.dispatchEvent(new Event("remove"))
        }
    }
}

export type Color = "white" | "black"
export type Type = "king" | "knight" | "rook"

export class Position {
    // @ts-ignore
    value: number
    constructor(value: number) {
        if (!Number.isSafeInteger(value) || !(1 <= value || value <= 8)) {
            return Object.create(null)
        }
        this.value = value
    }

    valueOf() {
        return this.value
    }
    toString() {
        return this.value.toString()
    }

    get index() {
        return this.value - 1
    }
}

export class Move {
    piece: Piece
    end: Position
    constructor(piece: Piece, end: Position) {
        this.piece = piece
        this.end = end
    }

    get start() {
        return this.piece.position
    }

    get legal() {

    }

    run() {
        this.piece.moveTo(this.end)
    }
}

export class Piece extends EventTarget {
    color: Color
    type: Type
    board: Board
    constructor(color: Color, type: Type, board: Board) {
        super()
        this.color = color
        this.type = type
        this.board = board
    }

    get position(): Position | null {
        return this.board.positionOf(this)
    }

    moveTo(dest: Position) {
        this.board.setPosition(dest, this)
    }

    getPossibleMoves() {
        if (!this.position) {
            return null
        }
        switch (this.type) {
            case "king": return []
            case "knight": return 
            case "rook": return 
            default: throw new Error("unreachable")
        }
    }
}