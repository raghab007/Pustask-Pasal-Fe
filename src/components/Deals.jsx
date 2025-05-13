import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import { Loader2, Tag } from "lucide-react";

const Deals = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/Books/on-sale?page=${currentPage}&pageSize=${pageSize}`
        );
        setBooks(response.data.books || []);
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching deals:", err);
        setError("Failed to fetch deals. Please try again later.");
        setLoading(false);
      }
    };

    fetchDeals();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Special Deals</h1>
        <p className="text-lg text-gray-600">
          Discover amazing deals on our featured books
        </p>
      </div>

      {!books || books.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No deals available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative aspect-[3/4]">
                  {book.frontImage ? (
                    <img
                      src={`http://localhost:5001/api/Images/Books/${book.frontImage}`}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  {book.isOnSale && book.discountStartDateTime && book.discountEndDateTime && (
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Tag size={14} className="mr-1" />
                        On Sale
                      </div>
                      <div className="bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Ends in: {Math.ceil((new Date(book.discountEndDateTime) - new Date()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {book.publisher}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 font-medium">
                        Rs {book.price}
                      </span>
                      {book.isOnSale && book.discountStartDateTime && book.discountEndDateTime && (
                        <div className="flex gap-2">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            From: {new Date(book.discountStartDateTime).toLocaleDateString()}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            To: {new Date(book.discountEndDateTime).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? "bg-black text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Next
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Deals; 