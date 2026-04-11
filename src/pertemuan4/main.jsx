import React from "react";
import ReactDOM from "react-dom/client";
import GuestView from "./pages/GuestView";
// import AdminView from "./pages/AdminView";
import "./tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GuestView />
    {/* <AdminView /> */}
  </React.StrictMode>
);