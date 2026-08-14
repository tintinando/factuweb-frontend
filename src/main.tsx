import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@picocss/pico/css/pico.green.min.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
