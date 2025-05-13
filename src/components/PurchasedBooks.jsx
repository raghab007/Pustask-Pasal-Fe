import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { getPurchasedBooks } from "../utils/orderUtils";
import { AuthContext } from "../contexts/AuthContext";
import { Loader2, Star, MessageSquare, Book, ShoppingBag, ChevronRight } from "lucide-react";
import axios from "axios";

const PurchasedBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getAuthHeader } = useContext(AuthContext);
    const [reviews, setReviews] = useState({});
    const [showReviewForm, setShowReviewForm] = useState({});
    const [expandedBook, setExpandedBook] = useState(null);

    useEffect(() => {
        const fetchPurchasedBooks = async () => {
            try {
                console.log("Fetching purchased books...");
                const response = await getPurchasedBooks(getAuthHeader);
                console.log("Response:", response);
                if (response.success) {
                    setBooks(response.data);
                    // Initialize reviews state for each book
                    const initialReviews = {};
                    response.data.forEach(book => {
                        initialReviews[book.id] = {
                            rating: book.userReview?.rating || 0,
                            comment: book.userReview?.comment || '',
                            isSubmitting: false
                        };
                    });
                    setReviews(initialReviews);
                } else {
                    setError(response.error);
                }
            } catch (err) {
                console.error("Error fetching books:", err);
                setError("Failed to fetch purchased books");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchasedBooks();
    }, [getAuthHeader]);

    const handleRatingChange = (bookId, rating) => {
        setReviews(prev => ({
            ...prev,
            [bookId]: {
                ...prev[bookId],
                rating
            }
        }));
    };

    const handleReviewSubmit = async (bookId) => {
        if (!reviews[bookId]?.rating) {
            // Show validation error
            return;
        }

        setReviews(prev => ({
            ...prev,
            [bookId]: {
                ...prev[bookId],
                isSubmitting: true
            }
        }));

        try {
            const response = await axios.post(
                'http://localhost:5001/api/Reviews',
                {
                    rating: reviews[bookId].rating,
                    comment: reviews[bookId].comment,
                    bookId: bookId
                },
                {
                    headers: getAuthHeader()
                }
            );

            if (response.data) {
                // Update the book's review in the local state
                setBooks(prevBooks => 
                    prevBooks.map(book => 
                        book.id === bookId 
                            ? { ...book, userReview: response.data }
                            : book
                    )
                );

                // Close the review form
                setShowReviewForm(prev => ({
                    ...prev,
                    [bookId]: false
                }));

                // Show success message
                alert("Review submitted successfully!");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert(error.response?.data || "Failed to submit review");
        } finally {
            setReviews(prev => ({
                ...prev,
                [bookId]: {
                    ...prev[bookId],
                    isSubmitting: false
                }
            }));
        }
    };

    const toggleBookExpansion = (bookId) => {
        setExpandedBook(expandedBook === bookId ? null : bookId);
    };

    const renderReviewSection = (book) => {
        const hasExistingReview = book.userReview !== null;
        const currentReview = reviews[book.id];
        
        console.log('Rendering review section for book:', {
            bookId: book.id,
            title: book.title,
            hasExistingReview,
            showReviewForm: showReviewForm[book.id],
            currentReview,
            userReview: book.userReview
        });

        if (hasExistingReview) {
            return (
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1 mb-2">
                        <span className="text-sm text-gray-600">Your Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-4 h-4 ${
                                    star <= book.userReview.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-700">{book.userReview.comment}</p>
                </div>
            );
        }

        if (showReviewForm[book.id]) {
            console.log('Showing review form for book:', book.id);
            return (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium text-gray-700 mr-2">Rating:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => handleRatingChange(book.id, star)}
                                    className="focus:outline-none p-1 transition-transform hover:scale-110"
                                    aria-label={`Rate ${star} stars`}
                                >
                                    <Star
                                        className={`w-6 h-6 ${
                                            star <= currentReview?.rating
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div>
                            <label htmlFor={`review-${book.id}`} className="text-sm font-medium text-gray-700 block mb-2">
                                Your review:
                            </label>
                            <textarea
                                id={`review-${book.id}`}
                                value={currentReview?.comment || ''}
                                onChange={(e) =>
                                    setReviews(prev => ({
                                        ...prev,
                                        [book.id]: {
                                            ...prev[book.id],
                                            comment: e.target.value
                                        }
                                    }))
                                }
                                placeholder="Share your thoughts about this book..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all resize-none"
                                rows="3"
                            />
                            {!currentReview?.rating && showReviewForm[book.id] && (
                                <p className="text-xs text-red-500 mt-1">Please select a rating</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowReviewForm(prev => ({ ...prev, [book.id]: false }))}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleReviewSubmit(book.id)}
                                disabled={currentReview?.isSubmitting || !currentReview?.rating}
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition-colors flex items-center min-w-[120px] justify-center"
                            >
                                {currentReview?.isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Review"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => {
                        console.log('Write review button clicked for book:', book.id);
                        setShowReviewForm(prev => ({ ...prev, [book.id]: true }));
                    }}
                    className="flex items-center text-black hover:text-gray-800 transition-colors group bg-white px-4 py-2 rounded-md border border-gray-200 hover:border-gray-400"
                >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span className="group-hover:underline font-medium">Write a Review</span>
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-gray-600 font-medium">Loading your library...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 px-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-md">
                    <h3 className="text-lg font-medium text-red-700 mb-2">Something went wrong</h3>
                    <p className="text-red-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 px-4 py-12">
                <div className="text-center max-w-md">
                    <div className="bg-gray-100 p-6 rounded-full inline-flex mb-6">
                        <ShoppingBag className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Your library is empty</h2>
                    <p className="text-gray-600 mb-6">You haven't purchased any books yet. Explore our collection and start building your personal library today.</p>
                    <Link
                        to="/books"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium shadow-sm"
                    >
                        Browse Books
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <header className="mb-8">
                    <div className="flex items-center mb-2">
                        <Book className="text-primary mr-2 h-6 w-6" />
                        <h1 className="text-2xl md:text-3xl font-bold">My Library</h1>
                    </div>
                    <p className="text-gray-600">Manage and review your purchased books</p>
                </header>

                <div className="grid gap-6">
                    {books.map((book) => (
                        <div 
                            key={book.id} 
                            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Book Image */}
                                <div className="md:w-1/5 lg:w-1/6">
                                    <Link to={`/books/${book.id}`}>
                                        <div className="relative aspect-[3/4] max-h-[240px] overflow-hidden">
                                            <img
                                                src={`http://localhost:5001/api/Images/Books/${book.frontImage}`}
                                                alt={book.title}
                                                className="w-full h-full object-cover transition-transform hover:scale-105"
                                                onError={(e) => {
                                                    e.target.src = "/api/placeholder/240/320";
                                                    e.target.alt = "Book cover not available";
                                                }}
                                            />
                                        </div>
                                    </Link>
                                </div>

                                {/* Book Details */}
                                <div className="p-5 md:p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1 line-clamp-2">
                                                <Link to={`/books/${book.id}`} className="hover:text-primary transition-colors">
                                                    {book.title}
                                                </Link>
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-2">{book.publisher}</p>
                                            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                                                Rs {book.price}
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => toggleBookExpansion(book.id)}
                                            className="text-gray-400 hover:text-primary transition-colors"
                                            aria-label={expandedBook === book.id ? "Collapse book details" : "Expand book details"}
                                        >
                                            <ChevronRight 
                                                className={`h-5 w-5 transition-transform ${expandedBook === book.id ? 'rotate-90' : ''}`} 
                                            />
                                        </button>
                                    </div>

                                    {/* Description - shown only when expanded */}
                                    {expandedBook === book.id && (
                                        <div className="my-4 text-gray-700 text-sm md:text-base">
                                            {book.description || "No description available."}
                                        </div>
                                    )}

                                    {/* Review Section */}
                                    {renderReviewSection(book)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PurchasedBooks;