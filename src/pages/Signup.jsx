// Signup.jsx
import React, { useState } from "react";
import { Link } from "react-router";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your signup logic here
    console.log("Signup data:", formData);
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
        <p className="text-gray-600">Join our community of book lovers</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="fullName" className="block mb-2 font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            placeholder="Enter your full name"
            required
          />
        </div>

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

        <div className="mb-6">
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
            placeholder="Create a password"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-2 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition duration-300"
        >
          Create Account
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">or sign up with</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            className="flex-1 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50 transition duration-300"
          >
            Google
          </button>
          <button
            type="button"
            className="flex-1 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50 transition duration-300"
          >
            Apple
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/auth/login"
            className="text-black font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
