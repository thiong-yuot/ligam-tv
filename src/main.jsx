import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Force module cache refresh - v2
createRoot(document.getElementById("root")).render(<App />);
