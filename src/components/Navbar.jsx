import { useState } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  LogIn,
  UserPlus,
  User2,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Add your search logic here
  };

  // For demo purposes only
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <nav className="bg-black text-white w-full">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="font-serif text-xl font-bold">
              Pustask Ghar
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="/" className="hover:text-gray-300">
                Home
              </a>
              <a href="/books" className="hover:text-gray-300">
                Books
              </a>
              <a href="/bestsellers" className="hover:text-gray-300">
                Bestsellers
              </a>
              <a href="/new-releases" className="hover:text-gray-300">
                New Releases
              </a>
              <a href="/deals" className="hover:text-gray-300">
                Deals
              </a>
            </div>
          </div>

          {/* Search, Cart, Account */}
          <div className="flex items-center space-x-6">
            {/* Search Input and Button */}
            <div className="hidden md:flex items-center">
              <input
                type="text"
                placeholder="Search books..."
                className="px-3 py-1 w-40 lg:w-64 bg-gray-900 text-white border border-gray-700 rounded-l focus:outline-none focus:border-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="px-3 py-1 bg-white text-black rounded-r hover:bg-gray-200"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Cart Icon */}
            <a href="/cart" className="hover:text-gray-300">
              <ShoppingBag size={20} />
            </a>

            {/* Conditional rendering based on login status */}
            {isLoggedIn ? (
              <a href="/account" className="hover:text-gray-300">
                <User size={20} />
              </a>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="flex items-center hover:text-gray-300"
                >
                  <LogIn size={20} className="mr-1" />
                  <span className="hidden lg:inline">Login</span>
                </a>
                <a
                  href="/auth/signup"
                  className="flex items-center hover:text-gray-300"
                >
                  <User2 size={20} className="mr-1" />
                  <span className="hidden lg:inline">Sign Up</span>
                </a>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:text-gray-300 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 w-full">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="mb-4 px-2">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search books..."
                  className="px-3 py-2 w-full bg-gray-900 text-white border border-gray-700 rounded-l focus:outline-none focus:border-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="px-3 py-2 bg-white text-black rounded-r hover:bg-gray-200"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            <a
              href="/"
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded"
            >
              Home
            </a>
            <a
              href="/books"
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded"
            >
              Books
            </a>
            <a
              href="/bestsellers"
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded"
            >
              Bestsellers
            </a>
            <a
              href="/new-releases"
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded"
            >
              New Releases
            </a>
            <a
              href="/deals"
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded"
            >
              Deals
            </a>

            {/* Login/Signup options for mobile */}
            <div className="border-t border-gray-800 pt-2 mt-2">
              {isLoggedIn ? (
                <a
                  href="/account"
                  className="flex items-center px-3 py-2 text-white hover:bg-gray-900 rounded"
                >
                  <User size={20} className="mr-2" />
                  My Account
                </a>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="flex items-center px-3 py-2 text-white hover:bg-gray-900 rounded"
                  >
                    <LogIn size={20} className="mr-2" />
                    Login
                  </a>
                  <a
                    href="/auth/signup"
                    className="flex items-center px-3 py-2 text-white hover:bg-gray-900 rounded"
                  >
                    <UserPlus size={20} className="mr-2" />
                    Sign Up
                  </a>
                </>
              )}
            </div>

            {/* Demo toggle button - remove in production */}
            <button
              onClick={toggleLogin}
              className="flex items-center px-3 py-2 mt-2 text-white bg-gray-800 hover:bg-gray-700 rounded w-full"
            >
              Demo: Toggle Login Status
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
