import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");

    if (!token || !expiration) {
      logout();
      return false;
    }

    const expirationDate = new Date(expiration);
    const currentDate = new Date();

    if (currentDate > expirationDate) {
      logout();
      return false;
    }

    return true;
  };

  const initializeAuth = async () => {
    const token = localStorage.getItem("token");
    if (token && checkTokenExpiration()) {
      try {
        // Fetch user data using the token
        const response = await axios.get("http://localhost:5001/api/Auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    // Initialize auth state on mount
    initializeAuth();

    // // Set up interval to check token expiration
    // const interval = setInterval(() => {
    //     checkTokenExpiration();
    // }, 60000); // Check every minute

    // return () => clearInterval(interval);
  }, []);

  const login = async (token, expiration) => {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiration", expiration);

    try {
      // Fetch user data after login
      const response = await axios.get("http://localhost:5001/api/Auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    setIsAuthenticated(false);
    setUser(null);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        login,
        logout,
        getAuthHeader,
        checkTokenExpiration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
