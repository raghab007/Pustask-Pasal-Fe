import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
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
  Sun,
  Moon,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Check if the current path is active
  const isActivePath = (path) => {
    return location.pathname === path || 
           (path !== "/admin" && location.pathname.startsWith(path));
  };

  return (
    <div
      className={`bg-gradient-to-b from-gray-900 to-black text-white ${
        isSidebarOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out flex flex-col shadow-xl`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {isSidebarOpen ? (
          <div className="flex items-center">
            <BookOpen size={24} className="text-blue-400" />
            <span className="ml-2 font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">PustakPasal</span>
          </div>
        ) : (
          <BookOpen className="mx-auto text-blue-400" size={24} />
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          <ChevronLeft
            size={20}
            className={`transform ${isSidebarOpen ? "" : "rotate-180"} text-gray-400`}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className={isSidebarOpen ? "mr-3" : "mx-auto"}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
          {isSidebarOpen && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, you would add/remove dark mode classes to the body
    // or use a theme context
  };

  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/admin") setPageTitle("Dashboard");
    else if (path.includes("/books")) setPageTitle("Books Management");
    else if (path.includes("/orders")) setPageTitle("Orders Management");
    else if (path.includes("/customers")) setPageTitle("Customer Management");
    else if (path.includes("/promotions")) setPageTitle("Promotions");
    else if (path.includes("/settings")) setPageTitle("Settings");
    else setPageTitle("Admin Dashboard");
  }, [location]);

  return (
    <div className={`flex h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b shadow-sm z-10`}>
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"} lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md`}
              >
                <Menu size={24} />
              </button>
              <h1 className="ml-4 text-xl font-semibold">{pageTitle}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`hidden md:flex items-center ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg px-3 py-1.5`}>
                <Search size={18} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`${isDarkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-100 text-gray-700 placeholder-gray-500"} border-none focus:outline-none px-2 py-1 w-48`}
                />
              </div>

              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"} hover:opacity-80 transition-colors`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} relative`}>
                <Bell size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">AP</span>
                </div>
                <span className="hidden md:inline text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} p-6`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;