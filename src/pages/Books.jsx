import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import BookCard from "../components/BookCard";

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
  "BLACK_MAGIC"
];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;
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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Update loading states based on action type
        if (initialLoad) {
          setLoading(true);
        } else if (!isSearching && !isFiltering) {
          setLoading(true);
        }
        
        let url = `http://localhost:5001/api/Books`;
        
        // Determine which endpoint to call based on filters
        if (debouncedSearchQuery) {
          url = `http://localhost:5001/api/Books/search?title=${encodeURIComponent(debouncedSearchQuery)}&page=${currentPage}&pageSize=${pageSize}`;
        } else if (selectedGenre) {
          url = `http://localhost:5001/api/Books/by-genre-type?genreType=${encodeURIComponent(selectedGenre)}&page=${currentPage}&pageSize=${pageSize}`;
        } else {
          url = `http://localhost:5001/api/Books?page=${currentPage}&pageSize=${pageSize}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.books || data.Books); // Handle different response structures
        setTotalCount(data.totalCount);
        setInitialLoad(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setIsSearching(false);
        setIsFiltering(false);
      }
    };

    // Reset to page 1 when search or genre changes
    if (currentPage === 1) {
      fetchBooks();
    } else {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, selectedGenre, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
    setSelectedGenre("");
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };
  
  const handleGenreChange = (e) => {
    setIsFiltering(true);
    setSelectedGenre(e.target.value);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Discover Books</h1>

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
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-300 px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              disabled={loading}
            >
              <option value="">All Genres</option>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre.replace(/_/g, ' ')}
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
              onChange={(e) => setSortBy(e.target.value)}
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
        {(searchQuery || selectedGenre) && (
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
            
            {selectedGenre && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                <span className="mr-1">Genre: {selectedGenre.replace(/_/g, ' ')}</span>
                <button onClick={() => setSelectedGenre("")} className="focus:outline-none">
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
                  <Loader2 size={30} className="animate-spin text-blue-500 mb-2" />
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
                    originalPrice={book.isOnSale ? Math.round(book.price * (1 + (book.discountPercentage || 0) / 100)) : null}
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
                <p className="text-gray-400 mt-2">Try adjusting your search terms or filters.</p>
                {(searchQuery || selectedGenre) && (
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
                Showing {sortedBooks.length} of {totalCount} books
              </div>
              
              <div className="flex items-center">
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || loading}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">First page</span>
                    <ChevronLeft size={20} className="h-5 w-5" aria-hidden="true" />
                    <ChevronLeft size={20} className="h-5 w-5 -ml-4" aria-hidden="true" />
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft size={20} className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page Numbers */}
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    let pageNumber;
                    
                    // Calculate which page numbers to show
                    if (totalPages <= 5) {
                      pageNumber = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + idx;
                    } else {
                      pageNumber = currentPage - 2 + idx;
                    }
                    
                    // Only render if page number is valid
                    if (pageNumber > 0 && pageNumber <= totalPages) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          disabled={loading}
                          aria-current={currentPage === pageNumber ? "page" : undefined}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNumber
                              ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight size={20} className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Last page</span>
                    <ChevronRight size={20} className="h-5 w-5" aria-hidden="true" />
                    <ChevronRight size={20} className="h-5 w-5 -ml-4" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Error: {error}</p>
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