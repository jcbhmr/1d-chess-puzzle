import { useState, JSX } from "react";
import blackKing from "./assets/black-king.svg"
import blackKnight from "./assets/black-knight.svg"
import blackRook from "./assets/black-rook.svg"
import whiteKing from "./assets/white-king.svg"
import whiteKnight from "./assets/white-knight.svg"
import whiteRook from "./assets/white-rook.svg"

export function Piece({ piece, ...props }: { piece: { color: "white" | "black", type: "king" | "knight" | "rook" } }) {
  const url = {
    "white,king": whiteKing,
    "white,knight": whiteKnight,
    "white,rook": whiteRook,
    "black,king": blackKing,
    "black,knight": blackKnight,
    "black,rook": blackRook,
  }[[piece.color, piece.type].join()]
  return <img src={url} {...props} />
}

export function Board({ board }: { board: ({ color: "white" | "black", type: "king" | "knight" | "rook" } | null)[] }) {
  return (
    <div className="grid grid-cols-8 w-fit">
      {board.map((x, i) => (
        <div
          key={i}
          style={{
            backgroundColor: i % 2 === 0 ? "#b58763" : "#f0dab5",
          }}
        >
          {x ? <Piece piece={x} /> : null}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <Board board={[
      { color: "white", type: "king" },
      { color: "white", type: "knight" },
      { color: "white", type: "rook" },
      null,
      null,
      { color: "black", type: "rook" },
      { color: "black", type: "knight" },
      { color: "black", type: "king" },
    ]} />
  );
}
