import { Link } from "react-router";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  LogIn,
  UserPlus,
  User2,
  LogOut
} from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Add your search logic here
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-black text-white w-full sticky top-0 z-50 shadow-lg">
      <div className="w-full px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="font-serif text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors duration-200">
              Pustak Ghar
            </Link>
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
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium hover:text-gray-300 transition-colors duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                </Link>
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
            <Link 
              to="/cart" 
              className="relative hover:text-gray-300 transition-colors duration-200"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Conditional rendering based on authentication status */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="hover:text-gray-300 transition-colors duration-200"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <User size={20} />
                </button>
                <div className={`absolute right-0 w-48 mt-2 py-2 bg-black border border-gray-700 rounded-lg shadow-xl ${
                  isDropdownOpen ? 'block' : 'hidden'
                }`}>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="flex items-center space-x-1 hover:text-gray-300 transition-colors duration-200"
                >
                  <LogIn size={20} />
                  <span className="hidden lg:inline text-sm font-medium">Login</span>
                </Link>
                <Link
                  to="/auth/signup"
                  className="flex items-center space-x-1 bg-white text-black px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <User2 size={20} />
                  <span className="hidden lg:inline text-sm font-medium">Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:text-gray-300 focus:outline-none transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
            <Link
              key={item.href}
              to={item.href}
              className="block px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Login/Signup options for mobile */}
          <div className="border-t border-gray-800 pt-3 mt-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} className="mr-2" />
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag size={20} className="mr-2" />
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-red-400 hover:bg-gray-900 rounded-lg transition-colors duration-200"
                >
                  <LogOut size={20} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={20} className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center px-3 py-2 mt-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus size={20} className="mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
