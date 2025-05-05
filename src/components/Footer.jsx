import { useState } from "react";
import {
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with email: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company info */}
          <div>
            <h3 className="text-xl font-bold mb-4">BookHaven</h3>
            <p className="text-gray-400 mb-4">
              Your destination for discovering stories that inspire, entertain,
              and transform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <ChevronRight size={16} />
                  <span>Best Sellers</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <ChevronRight size={16} />
                  <span>New Releases</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <ChevronRight size={16} />
                  <span>Book Genres</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <ChevronRight size={16} />
                  <span>Author Spotlight</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <ChevronRight size={16} />
                  <span>My Account</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <ChevronRight size={16} />
                  <span>Order Tracking</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <ChevronRight size={16} />
                  <span>Returns & Exchanges</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <ChevronRight size={16} />
                  <span>Help Center</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Join Our Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Get exclusive offers and be the first to know about new releases.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-white"
              />
              <button
                onClick={handleSubscribe}
                className="w-full bg-white text-black font-medium py-2 px-4 rounded hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="border-t border-gray-800 pt-6 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
              <div className="flex items-center">
                <Phone size={18} className="mr-2" />
                <span className="text-gray-400">(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-2" />
                <span className="text-gray-400">support@bookhaven.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} BookHaven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
