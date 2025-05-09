// Login.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5001/api/Auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        // Use the login function from AuthContext
        login(response.data.token, response.data.expiration);
        
        // Show success message
        setShowSuccess(true);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        submit: error.response?.data?.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Enhanced Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
          <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-500 scale-100 animate-pulse relative z-10 w-full max-w-sm">
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-full p-4 mb-4 shadow-inner">
                <CheckCircle2 className="h-14 w-14 text-emerald-600 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h3>
              <p className="text-gray-600 text-center mb-3">Successfully signed in to Pustak Ghar</p>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-300 to-green-500 rounded-full mb-4"></div>
              <p className="text-sm text-gray-500">Redirecting you to homepage...</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-600">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-black font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;