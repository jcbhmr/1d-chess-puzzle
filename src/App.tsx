import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Vite + React</h1>
        <div className="card bg-gray-100 p-4 rounded-md shadow-md">
          <button
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p className="text-gray-600 mt-2">
            Edit <code className="bg-gray-200 px-1">src/App.tsx</code> and save
            to test HMR
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
