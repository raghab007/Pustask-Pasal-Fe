// Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { UserPlus, Mail, User, Lock, MapPin, Calendar, CheckCircle2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    firstName: "",
    lastName: "",
    age: "",
    password: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Username validation
    if (!formData.userName) {
      newErrors.userName = "Username is required";
    }

    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 100) {
      newErrors.age = "Age must be between 1 and 100";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/api/Auth/signup", {
        email: formData.email,
        userName: formData.userName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: parseInt(formData.age),
        password: formData.password,
        address: formData.address,
      });

      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        // Clear form data
        setFormData({
          email: "",
          userName: "",
          firstName: "",
          lastName: "",
          age: "",
          password: "",
          address: "",
        });
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/authlogin");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        submit: error.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-center text-4xl font-extrabold text-gray-900 mb-3">
          Create your account
        </h2>
        <p className="text-center text-base text-gray-600 mb-10">
          Already have an account?{" "}
          <Link to="/authlogin" className="font-medium text-black hover:text-gray-800">
            Sign in
          </Link>
        </p>

        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-lg sm:px-10">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-20 w-20 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                Registration Successful!
              </h3>
              <p className="text-base text-gray-600">
                Your account has been created successfully. Redirecting to login page...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-base font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.firstName ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-black focus:border-black text-base`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-base font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.lastName ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-black focus:border-black text-base`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-black focus:border-black text-base`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="userName" className="block text-base font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="userName"
                      id="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.userName ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-black focus:border-black text-base`}
                    />
                  </div>
                  {errors.userName && (
                    <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-base font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="age"
                      id="age"
                      min="1"
                      max="100"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.age ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-black focus:border-black text-base`}
                    />
                  </div>
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-black focus:border-black text-base`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-base font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.address ? "border-red-300" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-black focus:border-black text-base`}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {errors.submit && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {errors.submit}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
