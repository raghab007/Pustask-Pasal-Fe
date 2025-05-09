import { useContext, useState } from "react";
import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import AuthContext from "../contexts/AuthContext";

export default function BookCard({
  id,
  title = "The Silent Echo",
  author = "Elizabeth Marlowe",
  price = 24.99,
  originalPrice = 29.99,
  rating = 4.5,
  reviewCount = 142,
  isNewRelease = true,
  isBestseller = false,
  coverImage,
  isInFavorites = false
}) {
  const [isFavorite, setIsFavorite] = useState(isInFavorites);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, login,logout, checkTokenExpiration } = useContext(AuthContext);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    toast.info(`Added "${title}" to cart`);
  };

  const handleToggleFavorite = async () => {
    console.log("Clicked")
    // if (!checkTokenExpiration()) {
    //   toast.error("Your session has expired. Please login again.");
    //   return;
    // }

    if (!isAuthenticated) {
      toast.error("Please login to add to favorites");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`http://localhost:5001/api/favourites/remove/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        console.log(id)
       const response =  await axios.post(
          "http://localhost:5001/api/Favourites/add",
          { bookId: id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        toast.success("Added to favorites");
        console.log(response)

      }


      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          "Failed to update favorites";
      toast.error(errorMessage);
      
      // If unauthorized, log the user out
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/books/${id}`);
  };

  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white transition-all duration-300 hover:shadow-xl">
      {/* Book cover with badges */}
      <div className="relative">
        <img
          src={`http://localhost:5001/api/Images/Books/${coverImage}`}
          alt={`${title} by ${author}`}
          className="w-full h-64 object-cover cursor-pointer"
          onClick={handleViewDetails}
        />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-bold">
            {discount}% OFF
          </div>
        )}

        {/* New release badge */}
        {isNewRelease && (
          <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 text-xs font-bold border border-black">
            NEW
          </div>
        )}

        {/* Bestseller badge */}
        {isBestseller && (
          <div className="absolute top-10 right-2 bg-black text-white px-2 py-1 text-xs font-bold">
            BESTSELLER
          </div>
        )}
      </div>

      {/* Book info */}
      <div className="px-4 py-4">
        <div
          className="font-bold text-lg mb-1 line-clamp-1 cursor-pointer hover:text-gray-700"
          onClick={handleViewDetails}
        >
          {title}
        </div>
        <p className="text-gray-600 text-sm mb-2">{author}</p>

        {/* Ratings */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-gray-600 text-xs ml-1">({reviewCount})</span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-lg">Rs {price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-gray-500 text-sm line-through ml-2">
                Rs {originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* View Details button */}
            <button
              onClick={handleViewDetails}
              className="bg-gray-100 text-black p-2 rounded hover:bg-gray-200 transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>

            {/* Add to favorites button */}
            <button
              onClick={handleToggleFavorite}
              disabled={isLoading}
              className={`p-2 rounded transition-colors ${
                isFavorite
                  ? "bg-red-100 text-red-500 hover:bg-red-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={18} 
                className={isFavorite ? "fill-red-500" : ""} 
              />
              Add to favorite
            </button>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}