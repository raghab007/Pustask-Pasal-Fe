import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import BookCard from "../components/BookCard";

// Sample book data with real book cover images
const booksData = [
  {
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.5,
    reviewCount: 142,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: false,
    isBestseller: true,
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 19.99,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 387,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: false,
    isBestseller: true,
  },
  {
    id: 3,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 15.99,
    originalPrice: 21.99,
    rating: 4.6,
    reviewCount: 215,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: false,
    isBestseller: true,
  },
  {
    id: 4,
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 26.99,
    originalPrice: 32.99,
    rating: 4.9,
    reviewCount: 167,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: true,
    isBestseller: false,
  },
  {
    id: 5,
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    price: 22.99,
    originalPrice: null,
    rating: 4.3,
    reviewCount: 154,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: true,
    isBestseller: false,
  },
  {
    id: 6,
    title: "Verity",
    author: "Colleen Hoover",
    price: 18.99,
    originalPrice: 23.99,
    rating: 4.5,
    reviewCount: 312,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: false,
    isBestseller: true,
  },
  {
    id: 7,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    price: 16.99,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 289,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: false,
    isBestseller: true,
  },
  {
    id: 8,
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    price: 21.99,
    originalPrice: 27.99,
    rating: 4.4,
    reviewCount: 176,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: true,
    isBestseller: false,
  },
];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Filter books based on search only
  const filteredBooks = booksData.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort books based on selected criteria
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "priceLow":
        return a.price - b.price;
      case "priceHigh":
        return b.price - a.price;
      case "newest":
        return a.isNewRelease ? -1 : 1;
      case "rating":
        return b.rating - a.rating;
      case "featured":
      default:
        return a.isBestseller ? -1 : 1;
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Discover Books</h1>

      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
          <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-300 px-4 py-2 pr-8 rounded focus:outline-none focus:border-black"
          >
            <option value="featured">Featured</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="rating">Highest Rated</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-3 text-gray-500 pointer-events-none"
          />
        </div>
      </div>

      {/* Book Cards Grid */}
      {sortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No books found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}
