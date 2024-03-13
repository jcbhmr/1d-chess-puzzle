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
 * ℹ We extend the `EventTarget` class to add event bubbling support for non-DOM
 * nodes. The {@link EventTargetWithBubbling} class uses the `.parentNode`
 * getter to dispatch events up the hierarchy.
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

import assert from "node:assert"



export class AstrianChessColor {
    static #key = Symbol("#key");
    #color: "white" | "black";
    constructor(k: symbol, color: "white" | "black") {
        assert(k === AstrianChessColor.#key);
        assert(color === "white" || color === "black");
        this.#color = color;
    }
    static WHITE = new AstrianChessColor(AstrianChessColor.#key, "white");
    static BLACK = new AstrianChessColor(AstrianChessColor.#key, "black");
    get color() {
        return this.#color;
    }
    get isWhite() {
        return this.#color === "white";
    }
    get isBlack() {
        return this.#color === "black";
    }
    get opposite() {
        if (this.isWhite) {
            return AstrianChessColor.BLACK;
        } else {
            return AstrianChessColor.WHITE;
        }
    }
    toString() {
        return this.#color;
    }
}

export class AstrianChessPosition {
    #n: number;
    constructor(position: number) {
        assert(0 < position && position <= 8);
        this.#n = position;
    }
    add(other: AstrianChessPosition) {
        return new AstrianChessPosition(this.#n + +other);
    }
    sub(delta: AstrianChessPosition) {
        return new AstrianChessPosition(this.#n - +delta);
    }
    valueOf() {
        return this.#n;
    }
    toString() {
        return this.#n.toString();
    }
}

export class AstrianChessMove {
    #start: AstrianChessPosition;
    #end: AstrianChessPosition;
    constructor(start: AstrianChessPosition, end: AstrianChessPosition) {
        this.#start = start;
        this.#end = end;
    }
    get start() {
        return this.#start;
    }
    get end() {
        return this.#end;
    }
    get delta() {
        return this.#end.sub(this.#start);
    }
}

export abstract class AstrianChessPiece extends EventTargetWithBubbling {
    #color: AstrianChessColor;
    #position: AstrianChessPosition;
    constructor(color: AstrianChessColor, position: AstrianChessPosition, owner: AstrianChessColor) {
        super();
        this.#color = color;
        this.#position = position;
    }
    get color() {
        return this.#color;
    }
    get position() {
        return this.#position;
    }
    set position(position: AstrianChessPosition | number) {
        this.#position = typeof position === "number" ? new AstrianChessPosition(position) : position;
    }
    abstract getMovements(): AstrianChessMove[];
    possibleMoves(board: AstrianChessBoard) {
        return this.getMovements().filter((move) => {
            const end = move.end;
            return board.isInBounds(end) && !board.getPiece(end);
        });
    }
    legalMoves(board: AstrianChessBoard) {
        return this.possibleMoves(board);
    }
}

export class AstrianChessKing extends AstrianChessPiece {
    getMovements() {
        return [
            new AstrianChessMove(this.position, this.position.add(new AstrianChessPosition(-1))),
            new AstrianChessMove(this.position, this.position.add(new AstrianChessPosition(1))),
        ];
    }
}
