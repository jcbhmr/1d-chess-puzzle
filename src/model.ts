/**
 * This file defines all of the "data-side" library-like code to model the
 * structure of the game state and the associated "what can move where?" logic.
 *
 * - {@link AstrianChessGame} defines the overarching game logic like whose turn
 *   it is and high-level mutation operations like `movePiece()`.
 * - {@link AstrianChessBoard} outlines the game board and contains the
 *   underlying array data structure that holds the `AstrianChessPiece | null`
 *   data for each square of the chess board.
 * - {@link AstrianChessPlayer} represents a player. This class is predominately
 *   used as a convenience for filtering the complete game's list of pieces into
 *   those piece either owned by said player, captured by said player, or those
 *   currently in-play in service of said player. There are always exactly two
 *   `Player` instances in each game; one `"white"` and one `"black"`.
 * - {@link AstrianChessPiece} represents a piece. It's an abstract base class
 *   that other more specific classes like {@link AstrianChessKing} and
 *   {@link AstrianChessKnight} inherit from. It defines some default methods to
 *   interact with the game hierarchy model but relies on implementations to
 *   define the `getMovements()` method. As an example, the
 *   {@link AstrianChessKnight} class defines just `getMovements()` as `[new
 *   AstrianChessMove(-2), new AstrianChessMove(2)]`. Then the base class
 *   methods can make use of those deltas to narrow that list of possible
 *   movements into `possibleMoves()` (those that are contained on the board)
 *   and then `legalMoves()` (those that don't put you in check etc.).
 * - {@link AstrianChessMove} and {@link AstrianChessPosition} are just wrapper
 *   types around `number` to get stricter type checking on construction and
 *   operations.
 * - {@link AstrianChessColor} is a newtype of `"white" | "black"`.
 *
 * This model makes heavy use of the DOM's `EventTarget` class so that each
 * "node" in the game's hierarchy has the opportunity to listen for different
 * game events like `"capture"` and `"move"`.
 *
 * ℹ We extend the `EventTarget` class to add event bubbling for non-native
 * targets.
 *
 * Need a refresher on the rules?
 *
 * > Part b in the illustration shows an amusing Astrian analogue of chess. On a
 * > linear board a bishop is meaningless and a queen is the same as a rook, and
 * > so the pieces are limited to kings, knights and rooks. The only rule
 * > modification needed is that a knight moves two cells in either direction
 * > and can jump an intervening piece of either color. If the game is played
 * > rationally, will either White or Black win or will the game end in a draw?
 * > The question is surprisingly tricky to answer.
 * >
 * > ![part b](https://i.imgur.com/XtPnNo7.png)
 *
 * &mdash; [Scientific American Volume 243, Issue
 * 1](https://www.scientificamerican.com/issue/sa/1980/07-01/)
 *
 * There's a minimax AI implementation in {@link AstrianChessMinimax} from
 * `src/engine.ts` to see an example of how this class is used.
 *
 * @file
 */

class EventTargetWithBubbling extends EventTarget {
    dispatchEvent(event: Event) {
        return super.dispatchEvent(event) || ((this as EventTarget & { parentNode?: EventTarget }).parentNode?.dispatchEvent(event) ?? false)
    }
  }
  

export type $1DChessColor = "white" | "black"

export class $1DChessGame extends EventTarget {
    playerWhite = new $1DChessPlayer("white", this)
    playerBlack = new $1DChessPlayer("black", this)
    currentPlayer = this.playerWhite;
    board = new $1DChessBoard(this)
    constructor() {
        super()
    }

    get nextPlayer() {
        if (this.currentPlayer === this.playerWhite) {
            return this.playerBlack
        } else {
            return this.playerWhite
        }
    }
}

export class $1DChessBoard extends EventTarget {
    game: $1DChessGame
    pieces: $1DChessPiece[]
    layout: ($1DChessPiece | null)[]
    constructor(game: $1DChessGame) {
        super()
        this.game = game
        this.pieces = [
            new $1DChessPiece("king", this.game.playerWhite),
            new $1DChessPiece("knight", this.game.playerWhite),
            new $1DChessPiece("rook", this.game.playerWhite),
            new $1DChessPiece("king", this.game.playerBlack),
            new $1DChessPiece("knight", this.game.playerBlack),
            new $1DChessPiece("rook", this.game.playerBlack),
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

    at(position: $1DChessPosition) {
        return this.layout[position - 1]
    }

    getCaptured() {
        return this.pieces.filter(piece => piece.captured)
    }

    get parentNode() {
        return this.game
    }
}

export class $1DChessPlayer extends EventTarget {
    game: $1DChessGame
    color: $1DChessColor
    constructor(color: $1DChessColor, game: $1DChessGame) {
        super()
        this.game = game
        this.color = color
    }

    get board() {
        return this.game.board
    }

    getPieces() {
        return this.game.board.pieces.filter(piece => piece.owner === this)
    }

    movePiece(piece: $1DChessPiece, newPosition: $1DChessPosition) {
        if (this.game.currentPlayer !== this) {
            throw new DOMException("It's not your turn", "InvalidStateError")
        }
        if (piece.owner !== this) {
            throw new DOMException("You don't own that piece", "HierarchyRequestError")
        }
        if (!piece.position) {
            throw new DOMException("That piece is captured", "InvalidStateError")
        }
        
        const moves = piece.getLegalMoves()!
        if (!moves.includes(newPosition)) {
            throw new DOMException("Invalid move", "InvalidStateError")
        }
        
        const target = this.board.at(newPosition)
        if (target) {
            target.dispatchEvent(new Event("capture", { bubbles: true }))
            target.dispatchEvent(new Event("capture", { bubbles: true }))
        }
        this.board.layout[newPosition - 1] = piece
        this.board.layout[piece.position - 1] = null
        piece.dispatchEvent(new Event("move"))

        this.game.currentPlayer = this.game.nextPlayer
        this.game.dispatchEvent(new Event("turn"))
    }

    get parentNode() {
        return this.game
    }
}

export type $1DChessPieceType = "king" | "knight" | "rook"

export type $1DChessPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export class $1DChessPiece extends EventTarget {
    owner: $1DChessPlayer
    type: $1DChessPieceType
    constructor(type: $1DChessPieceType, owner: $1DChessPlayer) {
        super()
        this.type = type
        this.owner = owner
    }

    get game() {
        return this.owner.game
    }

    get board() {
        return this.owner.board
    }

    get position() {
        return this.board.layout.indexOf(this) + 1 || null
    }

    get captured() {
        return !!this.position
    }

    getMoves() {
        if (!this.position) {
            return null
        }
        const moves: $1DChessPosition[] = []
        switch (this.type) {
            case "king":
                if (this.position > 1) {
                    moves.push(this.position - 1 as $1DChessPosition)
                }
                if (this.position < 8) {
                    moves.push(this.position + 1 as $1DChessPosition)
                }
                break
            case "knight":
                if (this.position > 2) {
                    moves.push(this.position - 2 as $1DChessPosition)
                }
                if (this.position < 7) {
                    moves.push(this.position + 2 as $1DChessPosition)
                }
                break
            case "rook":
                for (let i = 1; i <= 8; i++) {
                    if (i !== this.position) {
                        moves.push((i - this.position) as $1DChessPosition)
                    }
                }
                break
        }
        return moves
    }

    get parentNode() {
        return this.owner
    }
}
