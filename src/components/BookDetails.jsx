import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Star,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Share2,
  BookOpen,
  Calendar,
  Building,
  Tag,
  ChevronLeft,
  ChevronRight,
  Info,
  User,
  BookText
} from "lucide-react";
import axios from "axios";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isWishlist, setIsWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/Books/${id}`);
        setBook(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load book details");
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    alert(`Added ${quantity} copy/copies of "${book.title}" to cart`);
  };

  const handleToggleWishlist = () => {
    setIsWishlist(!isWishlist);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= book.stock) {
      setQuantity(value);
    }
  };

  const getBookImages = () => {
    if (!book) return [];
    const images = [];
    if (book.frontImage) images.push(book.frontImage);
    if (book.backImage) images.push(book.backImage);
    // If more images are available in the API response, add them here
    return images;
  };

  const nextImage = () => {
    if (!book) return;
    const images = getBookImages();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    if (!book) return;
    const images = getBookImages();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || "Book not found"}</h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = getBookImages();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Books
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Left Column - Book Images with Slider */}
            <div className="space-y-4">
              <div className="relative">
                {images.length > 0 && (
                  <div className="relative h-96 w-full">
                    <img
                      src={`http://localhost:5001/api/Images/Books/${images[currentImageIndex]}`}
                      alt={`${book.title} - ${currentImageIndex === 0 ? 'front cover' : 'back cover'}`}
                      className="w-full h-full object-contain rounded-lg"
                    />
                    
                    {/* Image Navigation Controls */}
                    {images.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage} 
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white shadow-md"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          onClick={nextImage} 
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white shadow-md"
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {images.map((_, idx) => (
                            <button 
                              key={idx} 
                              className={`w-3 h-3 rounded-full ${
                                currentImageIndex === idx ? 'bg-black' : 'bg-gray-300'
                              } focus:outline-none`}
                              onClick={() => setCurrentImageIndex(idx)}
                              aria-label={`Go to image ${idx + 1}`}
                            ></button>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {/* Badges */}
                    {book.isOnSale && (
                      <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-bold rounded">
                        ON SALE
                      </div>
                    )}
                    {book.isBestSeller && (
                      <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-sm font-bold rounded">
                        BESTSELLER
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Preview */}
              {images.length > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                  {images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                        currentImageIndex === idx ? 'border-black' : 'border-transparent'
                      } focus:outline-none`}
                    >
                      <img 
                        src={`http://localhost:5001/api/Images/Books/${image}`}
                        alt={`${book.title} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Book Summary Card */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Quick Info</h2>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        book.isAvailable ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-gray-600">
                      {book.isAvailable ? `${book.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen size={16} className="text-gray-400" />
                    <span className="text-gray-600 text-sm truncate">ISBN: {book.isbn}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-600 text-sm truncate">
                      {new Date(book.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building size={16} className="text-gray-400" />
                    <span className="text-gray-600 text-sm truncate">{book.publisher}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Info size={16} className="text-gray-400" />
                    <span className="text-gray-600 text-sm truncate">{book.releaseStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Book Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                
                {/* Authors with better styling */}
                <div className="mb-4">
                  <p className="text-gray-600 text-lg">
                    by {book.authors?.map((author, idx) => (
                      <span key={idx} className="inline-block">
                        {idx > 0 && ", "}
                        <span className="font-medium hover:underline cursor-pointer">
                          {author.name}
                        </span>
                      </span>
                    ))}
                  </p>
                </div>
                
                {/* Genres badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.genres?.map((genre, idx) => (
                    <span 
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {genre.genreType}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(book.rating || 0) ? "text-yellow-400" : "text-gray-300"}
                      fill={i < Math.floor(book.rating || 0) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  ({book.totalReviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  Rs {book.price.toFixed(2)}
                </span>
                {book.isOnSale && book.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    Rs {book.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              {book.isAvailable && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label htmlFor="quantity" className="text-gray-700">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={book.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart size={20} className="mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleToggleWishlist}
                      className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        size={20}
                        className={isWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}
                      />
                    </button>
                    <button
                      className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="Share book"
                    >
                      <Share2 size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tabbed Content Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "description" 
                      ? "border-b-2 border-black text-black" 
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <BookText size={16} className="mr-2" />
                      Description
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("authors")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "authors" 
                      ? "border-b-2 border-black text-black" 
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      Authors
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "details" 
                      ? "border-b-2 border-black text-black" 
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <Info size={16} className="mr-2" />
                      Details
                    </div>
                  </button>
                </div>

                <div className="py-4">
                  {activeTab === "description" && (
                    <div className="prose max-w-none">
                      <p className="text-gray-600 whitespace-pre-line">{book.description}</p>
                    </div>
                  )}

                  {activeTab === "authors" && (
                    <div className="space-y-6">
                      {book.authors?.map((author, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {author.name}
                          </h3>
                          <p className="text-gray-600">{author.bio}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "details" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">ISBN</h3>
                          <p className="mt-1 text-sm text-gray-900">{book.isbn}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Publisher</h3>
                          <p className="mt-1 text-sm text-gray-900">{book.publisher}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Publication Date</h3>
                          <p className="mt-1 text-sm text-gray-900">{new Date(book.publishedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Language</h3>
                          <p className="mt-1 text-sm text-gray-900">{book.language || "English"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Pages</h3>
                          <p className="mt-1 text-sm text-gray-900">{book.pages || "Not specified"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Total Sold</h3>
                          <p className="mt-1 text-sm text-gray-900">{book.totalSold || 0}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Release Status</h3>
                          <p className="mt-1 text-sm text-gray-900">{book.releaseStatus}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Genres</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {book.genres?.map(genre => genre.genreType).join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}