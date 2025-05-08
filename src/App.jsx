import { useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router";
import routes from "./routes/routes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <>
      <AuthProvider><RouterProvider router={routes} />
      </AuthProvider>
    </>
  );
}

export default App;
