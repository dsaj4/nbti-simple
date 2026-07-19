import "@fontsource-variable/noto-serif-sc/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./ui/global.css";
import "./ui/home/home.css";
import "./ui/quiz/quiz.css";
import "./ui/report/report.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("应用挂载节点不存在");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
