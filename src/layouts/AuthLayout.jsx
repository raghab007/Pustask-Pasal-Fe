// AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar - Black Section */}
      <div className="hidden md:flex md:w-2/5 bg-black text-white p-8 flex-col justify-between">
        <div>
          <div className="text-2xl font-bold mb-8">Pustak Ghar</div>
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Discover worlds between pages.
          </h1>
          <p className="text-gray-300 leading-relaxed">
            Your personal sanctuary for literary treasures. Browse our extensive
            collection and find your next favorite story.
          </p>
        </div>
        <div className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Book Haven. All rights reserved.
        </div>
      </div>

      {/* Main Content - White Section */}
      <div className="w-full md:w-3/5 bg-white p-6 flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
