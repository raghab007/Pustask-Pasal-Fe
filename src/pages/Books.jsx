import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import BookCard from "../components/BookCard";
import { useSearchParams } from "react-router";
import axios from "axios";
import { getBooks } from "../utils/bookUtils";

const GENRES = [
  "THRILLER",
  "FANTASY",
  "ROMANCE",
  "COMEDY",
  "ADVENTURE",
  "MYSTERY",
  "HISTORY",
  "SCIENCE_FICTION",
  "HORROR",
  "ACTION",
  "DRAMA",
  "MUSIC",
  "POETRY",
  "SPORTS",
  "FANTASY_FICTION",
  "NON_FICTION",
  "LOVE_STORY",
  "BLACK_MAGIC",
];

export default function BooksPage() {
  const [searchParams] = useSearchParams();
  const genreFromUrl = searchParams.get("genre");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedGenre, setSelectedGenre] = useState(genreFromUrl || "ALL");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Add debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update selectedGenre when URL changes
  useEffect(() => {
    if (genreFromUrl) {
      setSelectedGenre(genreFromUrl);
    }
  }, [genreFromUrl]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (initialLoad) {
          setLoading(true);
        } else if (!isSearching && !isFiltering) {
          setLoading(true);
        }

        const response = await getBooks(currentPage, itemsPerPage, debouncedSearchQuery, selectedGenre, sortBy);
        if (response.success) {
          setBooks(response.data.books);
          setTotalItems(response.data.totalCount);
          setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
          console.log('Pagination info:', {
            currentPage,
            totalItems: response.data.totalCount,
            itemsPerPage,
            totalPages: Math.ceil(response.data.totalCount / itemsPerPage)
          });
        } else {
          setError(response.error);
        }
        setInitialLoad(false);
      } catch (err) {
        setError("Failed to fetch books. Please try again later.");
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
        setIsSearching(false);
        setIsFiltering(false);
      }
    };

    fetchBooks();
  }, [debouncedSearchQuery, selectedGenre, currentPage, sortBy]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? "bg-black text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } border border-gray-200`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  // Sort books based on selected criteria
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "priceLow":
        return a.price - b.price;
      case "priceHigh":
        return b.price - a.price;
      case "newest":
        return new Date(b.publishedDate) - new Date(a.publishedDate);
      case "featured":
      default:
        return a.releaseStatus === "Published" ? -1 : 1;
    }
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("ALL");
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  const handleGenreChange = (genre) => {
    setIsFiltering(true);
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {selectedGenre === "ALL" ? "All Books" : `${selectedGenre.replace(/_/g, " ")} Books`}
        </h1>
        {selectedGenre !== "ALL" && (
          <p className="mt-2 text-lg text-gray-600">
            Explore our collection of {selectedGenre.replace(/_/g, " ").toLowerCase()} books
          </p>
        )}
      </div>

      {/* Search, Filter, and Sort Bar */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            disabled={loading && !isSearching}
          />
          <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}

          {isSearching && (
            <span className="absolute right-3 top-2.5 text-blue-500">
              <Loader2 size={18} className="animate-spin" />
            </span>
          )}
        </form>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Genre Filter */}
          <div className="relative flex-grow sm:w-48">
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-300 px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              disabled={loading}
            >
              <option value="ALL">All Genres</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-3 text-gray-500 pointer-events-none"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative sm:w-48">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="appearance-none w-full bg-white border border-gray-300 px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              disabled={loading}
            >
              <option value="featured">Featured</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-3 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedGenre !== "ALL") && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">Active filters:</span>

            {searchQuery && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                <span className="mr-1">Search: {searchQuery}</span>
                <button onClick={clearSearch} className="focus:outline-none">
                  <X size={14} />
                </button>
              </div>
            )}

            {selectedGenre !== "ALL" && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                <span className="mr-1">
                  Genre: {selectedGenre.replace(/_/g, " ")}
                </span>
                <button
                  onClick={() => handleGenreChange("ALL")}
                  className="focus:outline-none"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Initial Loading State */}
      {initialLoad ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
          <p className="text-gray-600 text-lg">Loading books...</p>
        </div>
      ) : (
        <>
          {/* Book Cards Grid with Loading Overlay */}
          <div className="relative">
            {/* Loading Overlay */}
            {loading && !initialLoad && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                  <Loader2
                    size={30}
                    className="animate-spin text-blue-500 mb-2"
                  />
                  <p className="text-gray-600">Updating results...</p>
                </div>
              </div>
            )}

            {/* Books Grid */}
            {sortedBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.authors?.[0]?.name || book.publisher}
                    price={book.price}
                    originalPrice={
                      book.isOnSale
                        ? Math.round(
                            book.price *
                              (1 + (book.discountPercentage || 0) / 100)
                          )
                        : null
                    }
                    rating={4.5}
                    reviewCount={book.totalReviews || 0}
                    coverImage={book.frontImage}
                    isNewRelease={book.releaseStatus === "Coming Soon"}
                    isBestseller={book.isBestSeller}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-200">
                  <Search size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  No books found matching your criteria.
                </p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search terms or filters.
                </p>
                {(searchQuery || selectedGenre !== "ALL") && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {sortedBooks.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                Showing {sortedBooks.length} of {totalItems} books
              </div>

              <div className="flex items-center">
                {renderPagination()}
              </div>
            </div>
          )}
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-700 hover:underline"
          >
            Try refreshing the page
          </button>
        </div>
      )}
    </div>
  );
}
