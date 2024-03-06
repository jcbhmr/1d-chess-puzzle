export type Color = "white" | "black"

export class Game {
    playerWhite = new Player("white", this)
    playerBlack = new Player("black", this)
    currentPlayer = this.playerWhite;
    board = new Board(this)

    get nextPlayer() {
        if (this.currentPlayer === this.playerWhite) {
            return this.playerBlack
        } else {
            return this.playerWhite
        }
    }
}

export class Board {
    game: Game
    pieces: Piece[]
    layout: (Piece | null)[]
    constructor(game: Game) {
        this.game = game
        this.pieces = [
            new Piece("king", this.game.playerWhite),
            new Piece("knight", this.game.playerWhite),
            new Piece("rook", this.game.playerWhite),
            new Piece("king", this.game.playerBlack),
            new Piece("knight", this.game.playerBlack),
            new Piece("rook", this.game.playerBlack),
        ]
        this.layout = [
            this.pieces[0],
            this.pieces[1],
            this.pieces[2],
            null,
            null,
            this.pieces[3],
            this.pieces[4],
            this.pieces[5],
        ]
    }

    get(position: Position) {
        return this.layout[position - 1]
    }
}

export class Player {
    game: Game
    color: Color
    constructor(color: Color, game: Game) {
        this.game = game
        this.color = color
    }

    get pieces() {}
}

export type PieceType = "king" | "knight" | "rook"

export type Position = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export class Piece {
    owner: Player
    type: PieceType
    constructor(type: PieceType, owner: Player) {
        this.type = type
        this.owner = owner
    }

    get game() {
        return this.owner.game
    }

    get position() {
        return this.owner.game.board.layout.indexOf(this) + 1 || null
    }

    get captured() {
        return !!this.position
    }
}