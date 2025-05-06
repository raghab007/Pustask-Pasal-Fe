import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import BookImg from "../assets/book.jpg";

export default function BookCard({
  id = 1,
  title = "The Silent Echo",
  author = "Elizabeth Marlowe",
  price = 24.99,
  originalPrice = 29.99,
  rating = 4.5,
  reviewCount = 142,
  coverImage = "/api/placeholder/240/350",
  isNewRelease = true,
  isBestseller = false,
}) {
  const [isWishlist, setIsWishlist] = useState(false);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    alert(`Added "${title}" to cart`);
  };

  const handleToggleWishlist = () => {
    setIsWishlist(!isWishlist);
  };

  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white transition-all duration-300 hover:shadow-xl">
      {/* Book cover with badges */}
      <div className="relative">
        <img
          src={`http://localhost:5001/api/Images/Books/${coverImage}`}
          alt={`${title} by ${author}`}
          className="w-full h-64 object-cover"
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

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <Heart
            size={20}
            className={isWishlist ? "fill-black text-black" : "text-gray-600"}
          />
        </button>
      </div>

      {/* Book info */}
      <div className="px-4 py-4">
        <div className="font-bold text-lg mb-1 line-clamp-1">{title}</div>
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
                    ? "fill-black text-black"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-gray-600 text-xs ml-1">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-lg">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-gray-500 text-sm line-through ml-2">
                Rs {originalPrice.toFixed(2)}
              </span>
            )}
          </div>

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
  );
}
