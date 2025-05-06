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

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();

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
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {isSidebarOpen ? (
          <div className="flex items-center">
            <BookOpen size={24} />
            <span className="ml-2 font-bold text-xl">PustakPasal</span>
          </div>
        ) : (
          <BookOpen className="mx-auto" size={24} />
        )}
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

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
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
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none focus:outline-none text-gray-700 px-2 py-1 w-40"
                />
              </div>

              <button className="p-1 text-gray-600 hover:text-gray-900 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">AP</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
