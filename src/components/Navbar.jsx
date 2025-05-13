import { Link } from "react-router";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  LogIn,
  UserPlus,
  User2,
  LogOut,
  ChevronDown,
  BookOpen,
} from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const dropdownRef = useRef(null);
  const exploreRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setIsExploreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const exploreItems = [
    { href: "/bestsellers", label: "Bestsellers" },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/new-releases", label: "New Releases" },
    { href: "/coming-soon", label: "Coming Soon" },
    { href: "/deals", label: "Deals" },
  ];

  return (
    <nav className="bg-black text-white w-full sticky top-0 z-50 shadow-lg">
      <div className="w-full px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="font-serif text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors duration-200"
            >
              Pustak Ghar
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-sm font-medium hover:text-gray-300 transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>

              <Link
                to="/books"
                className="text-sm font-medium hover:text-gray-300 transition-colors duration-200 relative group"
              >
                Books
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>

              {/* Explore Dropdown */}
              <div className="relative" ref={exploreRef}>
                <button
                  onClick={() => setIsExploreOpen(!isExploreOpen)}
                  className="flex items-center text-sm font-medium hover:text-gray-300 transition-colors duration-200"
                >
                  Explore
                  <ChevronDown size={16} className="ml-1" />
                </button>
                <div
                  className={`absolute left-0 mt-2 w-48 bg-black border border-gray-700 rounded-lg shadow-xl ${
                    isExploreOpen ? "block" : "hidden"
                  }`}
                >
                  {exploreItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                      onClick={() => setIsExploreOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <Link
                to="/categories"
                className="text-sm font-medium hover:text-gray-300 transition-colors duration-200 relative group"
              >
                Categories
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Cart and Account */}
          <div className="flex items-center space-x-6">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative hover:text-gray-300 transition-colors duration-200"
            >
              <ShoppingBag size={20} />
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
                <div
                  className={`absolute right-0 w-48 mt-2 py-2 bg-black border border-gray-700 rounded-lg shadow-xl ${
                    isDropdownOpen ? "block" : "hidden"
                  }`}
                >
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
                  <span className="hidden lg:inline text-sm font-medium">
                    Login
                  </span>
                </Link>
                <Link
                  to="/auth/signup"
                  className="flex items-center space-x-1 bg-white text-black px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <User2 size={20} />
                  <span className="hidden lg:inline text-sm font-medium">
                    Sign Up
                  </span>
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
          isMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-3 space-y-3">
          <Link
            to="/"
            className="block px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/books"
            className="block px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Books
          </Link>

          {/* Explore Section in Mobile Menu */}
          <div className="border-t border-gray-800 pt-3">
            <div className="px-3 py-2 text-gray-400 text-sm">Explore</div>
            {exploreItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Categories in Mobile Menu */}
          <Link
            to="/categories"
            className="block px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Categories
          </Link>

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
                  to="/auth/login"
                  className="flex items-center px-3 py-2 text-white hover:bg-gray-900 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={20} className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/auth/signup"
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
