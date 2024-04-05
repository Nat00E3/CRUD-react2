import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import Carros from "./pages/Carros.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/carros" element={<Carros />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
