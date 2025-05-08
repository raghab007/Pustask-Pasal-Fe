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
    <nav className="bg-black text-white w-full sticky top-0 z-50 shadow-lg">
      <div className="w-full px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="font-serif text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors duration-200">
              Pustak Ghar
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {[
                { href: "/", label: "Home" },
                { href: "/books", label: "Books" },
                { href: "/bestsellers", label: "Bestsellers" },
                { href: "/new-releases", label: "New Releases" },
                { href: "/deals", label: "Deals" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium hover:text-gray-300 transition-colors duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Search, Cart, Account */}
          <div className="flex items-center space-x-6">
            {/* Search Input and Button */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  className="px-4 py-2 w-40 lg:w-64 bg-gray-900 text-white border border-gray-700 rounded-l-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-0 top-0 h-full px-3 bg-white text-black rounded-r-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Cart Icon */}
            <a 
              href="/cart" 
              className="relative hover:text-gray-300 transition-colors duration-200"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </a>

            {/* Conditional rendering based on login status */}
            {isLoggedIn ? (
              <a 
                href="/account" 
                className="hover:text-gray-300 transition-colors duration-200"
              >
                <User size={20} />
              </a>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="flex items-center space-x-1 hover:text-gray-300 transition-colors duration-200"
                >
                  <LogIn size={20} />
                  <span className="hidden lg:inline text-sm font-medium">Login</span>
                </a>
                <a
                  href="/auth/signup"
                  className="flex items-center space-x-1 bg-white text-black px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <User2 size={20} />
                  <span className="hidden lg:inline text-sm font-medium">Sign Up</span>
                </a>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:text-gray-300 focus:outline-none transition-colors duration-200"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-black border-t border-gray-800 w-full transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 py-3 space-y-3">
          {/* Mobile Search */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {[
            { href: "/", label: "Home" },
            { href: "/books", label: "Books" },
            { href: "/bestsellers", label: "Bestsellers" },
            { href: "/new-releases", label: "New Releases" },
            { href: "/deals", label: "Deals" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}

          {/* Login/Signup options for mobile */}
          <div className="border-t border-gray-800 pt-3 mt-3">
            {isLoggedIn ? (
              <a
                href="/account"
                className="flex items-center px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
              >
                <User size={20} className="mr-2" />
                My Account
              </a>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="flex items-center px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
                >
                  <LogIn size={20} className="mr-2" />
                  Login
                </a>
                <a
                  href="/auth/signup"
                  className="flex items-center px-3 py-2 mt-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-200"
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
            className="flex items-center justify-center px-3 py-2 mt-3 text-white bg-gray-800 hover:bg-gray-700 rounded-lg w-full transition-colors duration-200"
          >
            Demo: Toggle Login Status
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
