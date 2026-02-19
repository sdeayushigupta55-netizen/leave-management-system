import "./i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { useUsers, UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext";
import type { ReactNode } from "react";
import { BeatBookProvider } from "./context/BeatBookContext";
import "./index.css";
import { PopulationDetailsProvider } from "./context/PopulationDetailsContext";

function AuthProviderWithUser({ children }: { children: ReactNode }) {
  const { updateUser } = useUsers();
  return <AuthProvider updateUser={updateUser}>{children}</AuthProvider>;
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <UserProvider>
          <AuthProviderWithUser>
            <BeatBookProvider>
              <PopulationDetailsProvider>
                <App />
              </PopulationDetailsProvider>
            </BeatBookProvider>
          </AuthProviderWithUser>
        </UserProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  throw new Error('Root element not found');
}
