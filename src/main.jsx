import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

// Start each fresh site visit on the dashboard, even when the browser restores
// a previously opened report URL. Keep the sign-in route available directly.
if (window.location.pathname !== "/" && window.location.pathname !== "/login") {
  window.history.replaceState(window.history.state, "", "/");
}

try {
  const preferences = JSON.parse(localStorage.getItem("domainreg_preferences") || "{}");
  document.documentElement.style.fontSize = preferences.textSize || "100%";
  document.documentElement.classList.toggle("high-contrast", !!preferences.highContrast);
} catch {
  document.documentElement.style.fontSize = "100%";
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
