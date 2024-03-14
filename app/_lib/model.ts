import { unreachable } from "./util";

export type AstrianChessPlayerColor = "white" | "black";

/** integer range [1,8] */
export type AstrianChessPosition = number

/** integer */
export type AstrianChessPositionDelta = number

export type AstrianChessPieceType = "king" | "knight" | "rook"

export interface AstrianChessPiece {
    type: AstrianChessPieceType
}

export interface AstrianChessPlayer {
    color: AstrianChessPlayerColor
    pieces: AstrianChessPiece[]
}

export type AstrianChessBoard = (AstrianChessPiece | null)[]

export interface AstrianChessGameJSON {
    currentPlayer: AstrianChessPlayer
    nextPlayer: AstrianChessPlayer
    board: AstrianChessBoard
}

export class AstrianChessGame {
    static fromJSON(json: AstrianChessGameJSON) {
        const game = new AstrianChessGame()
        game.board = json.board
        game.currentPlayer = json.currentPlayer
        game.nextPlayer = json.nextPlayer
        return game
    }

    currentPlayer: AstrianChessPlayer
    nextPlayer: AstrianChessPlayer
    board: AstrianChessBoard
    constructor() {
        const whitePieces = {
            king: { type: "king" },
            knight: { type: "knight" },
            rook: { type: "rook" },
        } as const
        const blackPieces = structuredClone(whitePieces)
        const white = { color: "white", pieces: Object.values(whitePieces) } as const
        const black = { color: "black", pieces: Object.values(blackPieces) } as const
        this.currentPlayer = white
        this.nextPlayer = black
        this.board = [
            whitePieces.king,
            whitePieces.knight,
            whitePieces.rook,
            null,
            null,
            blackPieces.rook,
            blackPieces.knight,
            blackPieces.king
        ]
    }

    get white() {
        if (this.currentPlayer.color === "white") {
            return this.currentPlayer
        } else if (this.nextPlayer.color === "white") {
            return this.nextPlayer
        } else {
            unreachable()
        }
    }

    get black() {
        if (this.currentPlayer.color === "black") {
            return this.currentPlayer
        } else if (this.nextPlayer.color === "black") {
            return this.nextPlayer
        } else {
            unreachable()
        }
    }

    getAllPieces() {
        return this.currentPlayer.pieces.concat(this.nextPlayer.pieces)
    }

    possibleMovesFor(piece: AstrianChessPiece): AstrianChessPositionDelta[] {
        let moves: AstrianChessPositionDelta[] = []
        switch (piece.type) {
            case "king": {
                moves.push(-1, 1)
                break
            }
            case "knight": {
                moves.push(-2, 2)
                break
            }
            case "rook": {
                for (let i = -1; i >= -8; i--) moves.push(i)
                for (let i = 1; i <= 8; i++) moves.push(i)
            }
        }
        moves = moves.filter(x => this.canMove(piece, x))
        return moves
    }

    canMove(piece: AstrianChessPiece, move: AstrianChessPositionDelta) {
        const position = this.positionOf(piece)
        if (!position) return false
        const target = position + move
        return this.canMoveTo(piece, target)
    }

    canMoveTo(piece: AstrianChessPiece, target: AstrianChessPosition) {
        const position = this.positionOf(piece)
        if (!position) return false

        if (this.ownerOf(piece) !== this.currentPlayer) return false

        if (target < 1 || 8 < target) return false
        const targetIndex = target - 1
        
        const wouldBeCaptured = this.board[targetIndex]
        if (wouldBeCaptured) {
            if (this.ownerOf(wouldBeCaptured) === this.ownerOf(piece)) {
                return false
            }
        }
        
        return true
    }

    movePiece(piece: AstrianChessPiece, move: AstrianChessPositionDelta) {
        const position = this.positionOf(piece)
        if (!position) throw new DOMException("no position")
        const target = position + move
        return this.movePieceTo(piece, target)
    }

    movePieceTo(piece: AstrianChessPiece, target: AstrianChessPosition) {
        if (!this.canMoveTo(piece, target)) throw new DOMException("can't move to")

        const position = this.positionOf(piece) ?? unreachable()
        const index = position - 1

        const targetIndex = target - 1
        const capturedPiece = this.board[targetIndex]
        this.board[targetIndex] = piece
        this.board[index] = null

        const oldPlayer = this.nextPlayer
        this.currentPlayer = this.nextPlayer
        this.nextPlayer = oldPlayer
    }

    positionOf(piece: AstrianChessPiece): AstrianChessPosition | null {
        const index = this.board.indexOf(piece)
        if (index === -1) {
            return null
        } else {
            return index + 1
        }
    }

    pieceAt(position: AstrianChessPosition): AstrianChessPiece | null {
        const index = position - 1
        return this.board[index]
    }

    getCapturedPieces() {
        return this.getAllPieces().filter(x => !this.positionOf(x))
    }

    ownerOf(piece: AstrianChessPiece): AstrianChessPlayer {
        if (this.currentPlayer.pieces.includes(piece)) {
            return this.currentPlayer
        } else if (this.nextPlayer.pieces.includes(piece)) {
            return this.nextPlayer
        } else {
            unreachable()
        }
    }

    isPlayerInCheck(player: AstrianChessPlayer) {
        return false
    }

    toJSON(): AstrianChessGameJSON {
        const { board, currentPlayer, nextPlayer } = this
        return { board, currentPlayer, nextPlayer }
    }

    clone(): AstrianChessGame {
        const json = this.toJSON()
        return AstrianChessGame.fromJSON(json)
    }

    toString() {
        return this.toFENLike()
    }

    pieceToFENLikeId(piece: AstrianChessPiece): string {
        const ownerColor = this.ownerOf(piece).color
        const isWhite = ownerColor === "white"
        switch (piece.type) {
            case "king": return isWhite ? "k" : "K"
            case "knight": return isWhite ? "n" : "N"
            case "rook": return isWhite ? "r" : "R"
            default: unreachable()
        }
    }

    toFENLike() {
        const body = this.board.reduce((a, x) => {
            const idOrDash = x ? this.pieceToFENLikeId(x) : "-"
            return a + idOrDash
        }, "")
        const isWhite = this.currentPlayer.color === "white"
        const currentPlayerMarker = isWhite ? "w" : "b"
        return `${body} ${currentPlayerMarker}`
    }
}
