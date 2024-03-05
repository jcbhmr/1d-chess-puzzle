export type Color = "white" | "black"

export class Game {
    playerWhite = this.createPlayer("white")
    playerBlack = this.createPlayer("black")
    currentPlayer = this.playerWhite;

    createPlayer(color: Color) {
        return new Player(color, this)
    }
}

export class Player {
    game: Game
    color: Color
    pieces: Piece[] = []
    constructor(color: Color, game: Game) {
        this.game = game
        this.color = color
    }

    createPiece(type: PieceType, position: Position | null = null) {
        return new Piece(type, position, this)
    }

    
}

export type PieceType = "king" | "knight" | "rook"

export type Position = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export class Piece {
    owner: Player
    type: PieceType
    position: Position | null
    constructor(type: PieceType, position: Position | null, owner: Player) {
        this.type = type
        this.position = position
        this.owner = owner
    }

    get game() {
        return this.owner.game
    }

    get captured() {
        return !!this.position
    }
}