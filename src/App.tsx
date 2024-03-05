import { useState, JSX } from "react";
import chessPiecesSprite from "./assets/Chess_Pieces_Sprite.svg";

export function Piece({ piece }: { piece: { color: "white" | "black", type: "king" | "knight" | "rook" } }) {
  const y = ["white", "black"].indexOf(piece.color);
  const x = ["king", "queen", "bishop", "knight", "rook", "pawn"].indexOf(piece.type);
  return (
    <div
      style={{
        width: "100px",
        height: "100px",
        backgroundImage: `url("${chessPiecesSprite}")`,
        backgroundPositionX: `${(x / 6) * 100}%`,
        backgroundPositionY: `${(y / 2) * 100}%`,
        backgroundSize: "100%"
        background
      }}
    />
  );
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
