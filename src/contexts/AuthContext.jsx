import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

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

    useEffect(() => {
        // Check token expiration on mount
        checkTokenExpiration();

        // Set up interval to check token expiration every minute
        const interval = setInterval(() => {
            checkTokenExpiration();
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const login = (token, expiration) => {
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiration", expiration);
        setIsAuthenticated(true);
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

    return (
        <AuthContext.Provider 
            value={{ 
                isAuthenticated, 
                user,
                setUser,
                login, 
                logout,
                getAuthHeader,
                checkTokenExpiration
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
