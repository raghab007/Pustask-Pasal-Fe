import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import {
  ChevronLeft,
  Menu,
  BookOpen,
  ShoppingBag,
  Users,
  Settings,
  BarChart2,
  Tag,
  Bell,
  LogOut,
  Search,
} from "lucide-react";

// Mock data for initial books
const initialBooks = [
  {
    id: "1",
    title: "The Great Gatsby",
    isbn: "9780743273565",
    publishedDate: "2004-09-30",
    publisher: "Scribner",
    price: 15,
    quantity: 25,
    totalSold: 1240,
    totalRating: 4,
    description:
      "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald.",
    totalReviews: "420",
    releaseStatus: "Published",
    isOnSale: true,
    isBestSeller: true,
    discountStartDate: "2025-05-01",
    discountEndDate: "2025-05-15",
    authors: ["F. Scott Fitzgerald"],
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    isbn: "9780061120084",
    publishedDate: "2006-05-23",
    publisher: "Harper Perennial",
    price: 12,
    quantity: 18,
    totalSold: 980,
    totalRating: 5,
    description:
      "To Kill a Mockingbird is a novel by Harper Lee published in 1960.",
    totalReviews: "350",
    releaseStatus: "Published",
    isOnSale: false,
    isBestSeller: true,
    discountStartDate: "",
    discountEndDate: "",
    authors: ["Harper Lee"],
  },
  {
    id: "3",
    title: "1984",
    isbn: "9780451524935",
    publishedDate: "1990-06-01",
    publisher: "Signet Classic",
    price: 9,
    quantity: 30,
    totalSold: 1560,
    totalRating: 4,
    description:
      "1984 is a dystopian novel by George Orwell published in 1949.",
    totalReviews: "520",
    releaseStatus: "Published",
    isOnSale: true,
    isBestSeller: true,
    discountStartDate: "2025-05-01",
    discountEndDate: "2025-06-01",
    authors: ["George Orwell"],
  },
];

// Sidebar Component
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  // Navigation items with icons
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart2 size={20} />,
      path: "/admin",
    },
    {
      id: "books",
      label: "Books",
      icon: <BookOpen size={20} />,
      path: "/admin/books",
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingBag size={20} />,
      path: "/admin/orders",
    },
    {
      id: "customers",
      label: "Customers",
      icon: <Users size={20} />,
      path: "/admin/customers",
    },
    {
      id: "promotions",
      label: "Promotions",
      icon: <Tag size={20} />,
      path: "/admin/promotions",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/admin/settings",
    },
  ];

  return (
    <div
      className={`bg-black text-white ${
        isSidebarOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {isSidebarOpen && (
          <div className="flex items-center">
            <BookOpen size={24} />
            <span className="ml-2 font-bold text-xl">PustakPasal</span>
          </div>
        )}
        {!isSidebarOpen && <BookOpen className="mx-auto" size={24} />}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-800 focus:outline-none"
        >
          <ChevronLeft
            size={20}
            className={`transform ${isSidebarOpen ? "" : "rotate-180"}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-1">
              <button
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full px-4 py-3 hover:bg-gray-900 transition-colors`}
              >
                <span className={isSidebarOpen ? "mr-4" : "mx-auto"}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-900 rounded transition-colors"
        >
          <LogOut size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
          {isSidebarOpen && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
};

// Main Layout Component
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [books, setBooks] = useState(initialBooks);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addBook = (newBook) => {
    setBooks([...books, newBook]);
  };

  const updateBook = (updatedBook) => {
    setBooks(
      books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="text-gray-600 lg:hidden"
              >
                <Menu size={24} />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none focus:outline-none text-gray-700 px-2 py-1 w-40"
                />
              </div>

              {/* Notifications */}
              <button className="p-1 text-gray-600 hover:text-gray-900 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Admin Profile */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">AP</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet context={{ books, addBook, updateBook }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
