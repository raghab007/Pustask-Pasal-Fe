import { useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router";
import routes from "./routes/routes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
