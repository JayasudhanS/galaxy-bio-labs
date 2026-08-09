import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";
if (!window.sessionStorage.getItem("gbl-nav-seeded")) {
  window.sessionStorage.setItem("gbl-nav-seeded", "1");
  if (window.location.pathname !== "/") {
    const currentUrl = window.location.href;
    window.history.replaceState({ gblHome: true }, "", "/");
    window.history.pushState(window.history.state, "", currentUrl);
  }
}

const router = getRouter();

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
