import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";
import { Award } from "lucide-react";

const AwardWinners = () => {
  const [awardWinners, setAwardWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAwardWinners = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/Books/award-winners");
        setAwardWinners(response.data.books);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch award-winning books");
        setLoading(false);
        console.error("Error fetching award-winning books:", err);
      }
    };

    fetchAwardWinners();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Award Winners</h2>
          <p className="mt-2 text-lg text-gray-600">
            Explore our collection of critically acclaimed and award-winning books
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {awardWinners.map((book) => (
            <Link
              to={`/books/${book.id}`}
              key={book.id}
              className="group bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative">
                <div className="aspect-w-2 aspect-h-3">
                  <img
                    src={`http://localhost:5001/api/Images/Books/${book.frontImage}`}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Award size={16} className="mr-1" />
                    Award Winner
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black truncate">
                  {book.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {book.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-black">
                    Rs {book.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {book.stock} in stock
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {awardWinners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No award-winning books available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AwardWinners; 