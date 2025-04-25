import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router";
import Router from "./routers/router.tsx";
import { makeServer } from "./mirage/server";
import AuthProvider from "./contexts/AuthContext";

// 只在開發模式啟用
// if (process.env.NODE_ENV === "development") {
//   makeServer();
// }

makeServer();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={Router} />
    </AuthProvider>
  </React.StrictMode>
);
reportWebVitals();
