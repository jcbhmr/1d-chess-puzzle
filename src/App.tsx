import { useState } from "react";



function App() {
  const [boardState, setBoardState] = useState<(keyof typeof pieceMap | null)[]>(() => [
    "whiteking",
    "whiteknight",
    "whiterook",
    null,
    null,
    "blackrook",
    "blackknight",
    "blackking",
  ]);

  function handleClick() {}

  return (
    <div className="flex justify-center mt-2">
      <table className="border-collapse border border-gray-400">
        <tbody>
          <tr>
            {boardState.map((x, i) => (
              <td key={i}
              className={`w-10 h-10 ${
                i % 2 === 0 ? "bg-emerald-100" : "bg-emerald-200"
              }`}>{pieceMap[x ?? "empty"]()}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
