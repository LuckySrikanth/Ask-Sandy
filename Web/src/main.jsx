import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { WebsiteProvider } from "./Context/WebsiteContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WebsiteProvider>
      <App />
    </WebsiteProvider>
  </StrictMode>
);
