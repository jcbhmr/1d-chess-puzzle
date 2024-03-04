import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { throw_ } from "./utils.ts";

const root =
  document.getElementById("root") ?? throw_(new ReferenceError("no #root"));
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
