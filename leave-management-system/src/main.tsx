import "./i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>

  <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>

  </AuthProvider>
    </React.StrictMode>
  );
} else {
  throw new Error('Root element not found');



}
