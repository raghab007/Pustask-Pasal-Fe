import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import { Loader2 } from "lucide-react";

const ComingSoon = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComingSoonBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/Books/coming-soon");
        // Handle the specific response format with books array and totalCount
        setBooks(response.data.books || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching coming soon books:", err);
        setError("Failed to fetch coming soon books. Please try again later.");
        setLoading(false);
      }
    };

    fetchComingSoonBooks();
  }, []);

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-600">
          Discover the most anticipated books that will be available soon
        </p>
      </div>

      {!books || books.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No upcoming books at the moment.</p>
        </div>
      ) : (
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
                <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
                  Coming Soon
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {book.publisher}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-gray-900 font-medium">
                    Rs {book.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(book.publishedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComingSoon; 