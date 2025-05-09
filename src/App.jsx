import { useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router";
import routes from "./routes/routes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={routes} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
