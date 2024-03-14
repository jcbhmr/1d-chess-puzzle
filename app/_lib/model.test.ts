import { expect, test } from "vitest";
import { AstrianChessGame } from "./model"
import { unreachable } from "./util";

test("my test", () => {
    const game = new AstrianChessGame()
    expect(game.toString()).toBe("knr--RNK w")

    const moves = game.possibleMovesFor(game.pieceAt(3) ?? unreachable())
    console.log(moves)

    game.movePieceTo(game.pieceAt(3) ?? unreachable(), 4)
    expect(game.toString()).toBe("kn-r-RNK b")
})