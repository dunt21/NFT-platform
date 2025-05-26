import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { inject } from "@vercel/analytics";
import App from "./App.jsx";
import Web3Provider from "./components/providers/Web3Provider";
import "./index.css";

inject(); // Vercel Analytics

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Web3Provider>
        <App />
      </Web3Provider>
    </BrowserRouter>
  </StrictMode>
);
