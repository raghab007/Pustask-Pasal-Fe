import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Clock,
  Gift,
  Star,
} from "lucide-react";
import BookCard from "../components/BookCard";
import BookImg from "../assets/book.jpg";
// Sample book data
const featuredBooks = [
  {
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.5,
    reviewCount: 142,
    coverImage: BookImg,
    isNewRelease: false,
    isBestseller: true,
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 19.99,
    originalPrice: 27.99,
    rating: 4.8,
    reviewCount: 387,
    coverImage: BookImg,
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
    coverImage: BookImg,
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
    coverImage: BookImg,
    isNewRelease: true,
    isBestseller: false,
  },
];

const newArrivals = [
  {
    id: 5,
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    price: 21.99,
    originalPrice: 27.99,
    rating: 4.4,
    reviewCount: 176,
    coverImage: BookImg,
    isNewRelease: true,
    isBestseller: false,
  },
  {
    id: 6,
    title: "Iron Flame",
    author: "Rebecca Yarros",
    price: 23.99,
    originalPrice: 29.99,
    rating: 4.7,
    reviewCount: 112,
    coverImage: BookImg,
    isNewRelease: true,
    isBestseller: false,
  },
  {
    id: 7,
    title: "The Atlas Paradox",
    author: "Olivie Blake",
    price: 18.99,
    originalPrice: 24.99,
    rating: 4.3,
    reviewCount: 89,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: true,
    isBestseller: false,
  },
  {
    id: 8,
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    price: 20.99,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 421,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: true,
    isBestseller: true,
  },
];

const onSaleBooks = [
  {
    id: 9,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 9.99,
    originalPrice: 17.99,
    rating: 4.3,
    reviewCount: 1021,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: false,
    isBestseller: false,
  },
  {
    id: 10,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 10.99,
    originalPrice: 19.99,
    rating: 4.8,
    reviewCount: 2238,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: false,
    isBestseller: true,
  },
  {
    id: 11,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 8.99,
    originalPrice: 15.99,
    rating: 4.7,
    reviewCount: 1567,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: false,
    isBestseller: false,
  },
  {
    id: 12,
    title: "1984",
    author: "George Orwell",
    price: 11.99,
    originalPrice: 21.99,
    rating: 4.6,
    reviewCount: 1892,
    coverImage: "/api/placeholder/240/350",
    isNewRelease: false,
    isBestseller: true,
  },
];

const bookCategories = [
  {
    id: 1,
    name: "Fiction",
    image: "/api/placeholder/400/250",
    count: 1245,
  },
  {
    id: 2,
    name: "Non-Fiction",
    image: "/api/placeholder/400/250",
    count: 876,
  },
  {
    id: 3,
    name: "Mystery & Thriller",
    image: "/api/placeholder/400/250",
    count: 543,
  },
  {
    id: 4,
    name: "Science Fiction",
    image: "/api/placeholder/400/250",
    count: 421,
  },
  {
    id: 5,
    name: "Fantasy",
    image: "/api/placeholder/400/250",
    count: 387,
  },
  {
    id: 6,
    name: "Romance",
    image: "/api/placeholder/400/250",
    count: 612,
  },
];

// Carousel component for book sections
const BookCarousel = ({ title, books, viewAllLink = "#" }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [carouselRef, setCarouselRef] = useState(null);

  useEffect(() => {
    if (carouselRef) {
      setMaxScroll(carouselRef.scrollWidth - carouselRef.clientWidth);
      setContainerWidth(carouselRef.clientWidth);
    }
  }, [carouselRef]);

  const handleScroll = (direction) => {
    const scrollAmount = containerWidth * 0.8;
    if (carouselRef) {
      if (direction === "left") {
        carouselRef.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        carouselRef.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleScrollEvent = () => {
    if (carouselRef) {
      setScrollPosition(carouselRef.scrollLeft);
    }
  };

  useEffect(() => {
    if (carouselRef) {
      carouselRef.addEventListener("scroll", handleScrollEvent);
      return () => carouselRef.removeEventListener("scroll", handleScrollEvent);
    }
  }, [carouselRef]);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <a
          href={viewAllLink}
          className="text-black hover:underline flex items-center"
        >
          View All <ChevronRight size={18} />
        </a>
      </div>
      <div className="relative">
        <button
          onClick={() => handleScroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 ${
            scrollPosition <= 10 ? "hidden" : ""
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        <div
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 pt-2"
          ref={setCarouselRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {books.map((book) => (
            <div key={book.id} className="min-w-[240px] max-w-[240px]">
              <BookCard {...book} />
            </div>
          ))}
        </div>
        <button
          onClick={() => handleScroll("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 ${
            scrollPosition >= maxScroll - 10 ? "hidden" : ""
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

// CategoryCard component
const CategoryCard = ({ category }) => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-md group">
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
        <h3 className="text-xl font-bold">{category.name}</h3>
        <p className="text-sm opacity-90">{category.count} Books</p>
      </div>
    </div>
  );
};

// Limited time offer countdown
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 23;
              if (days > 0) {
                days -= 1;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex space-x-4 justify-center">
      <div className="flex flex-col items-center">
        <div className="bg-black text-white text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center">
          {timeLeft.days}
        </div>
        <span className="text-sm mt-1">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-black text-white text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center">
          {String(timeLeft.hours).padStart(2, "0")}
        </div>
        <span className="text-sm mt-1">Hours</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-black text-white text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center">
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <span className="text-sm mt-1">Minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-black text-white text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center">
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
        <span className="text-sm mt-1">Seconds</span>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0 lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to Pustak Ghar
              </h1>
              <p className="text-lg text-gray-300 mb-6">
                Discover a world of stories waiting to be explored. Your journey
                through pages starts here.
              </p>
              <div className="flex space-x-4">
                <button className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition duration-300">
                  Shop Now
                </button>
                <button className="px-6 py-3 border border-white text-white font-medium rounded hover:bg-white hover:text-black transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src="/api/placeholder/600/350"
                alt="Books Collection"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
            <div className="bg-black text-white p-3 rounded-full">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Explore our vast collection of books across every genre and
                interest.
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
            <div className="bg-black text-white p-3 rounded-full">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your favorite books delivered to your doorstep within 2-3
                business days.
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
            <div className="bg-black text-white p-3 rounded-full">
              <Gift size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Gift Wrapping</h3>
              <p className="text-gray-600">
                Make your gift special with our premium gift wrapping service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Featured Books */}
        <BookCarousel
          title="Featured Books"
          books={featuredBooks}
          viewAllLink="/books"
        />

        {/* New Arrivals */}
        <BookCarousel
          title="New Arrivals"
          books={newArrivals}
          viewAllLink="/new-arrivals"
        />

        {/* Limited Time Offer */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-xl py-12 px-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Limited Time Offer</h2>
            <p className="text-lg mb-6">
              Get 25% off on all bestsellers and new releases. Don't miss out!
            </p>
            <CountdownTimer />
          </div>
          <div className="flex justify-center">
            <button className="px-6 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition duration-300">
              Shop the Sale
            </button>
          </div>
        </div>

        {/* On Sale Books */}
        <BookCarousel
          title="On Sale Books"
          books={onSaleBooks}
          viewAllLink="/sale"
        />

        {/* Book Categories */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Book Categories</h2>
            <a
              href="/categories"
              className="text-black hover:underline flex items-center"
            >
              All Categories <ChevronRight size={18} />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookCategories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.id}`}
                className="block"
              >
                <CategoryCard category={category} />
              </a>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "I absolutely love Pustak Ghar! The selection is amazing and the
                delivery is super fast. I've discovered so many great books
                here."
              </p>
              <div className="font-semibold">- Aarav Sharma</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The customer service is exceptional. When I had an issue with
                my order, they resolved it immediately. Will definitely be a
                returning customer!"
              </p>
              <div className="font-semibold">- Priya Patel</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "As an avid reader, I appreciate the wide variety of books
                available at Pustak Ghar. The prices are competitive and the
                website is easy to navigate."
              </p>
              <div className="font-semibold">- Rahul Gupta</div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gray-100 rounded-xl py-12 px-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to get updates on new releases, exclusive offers, and
            reading recommendations.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-l border border-gray-300 focus:outline-none focus:border-black sm:rounded-r-none"
            />
            <button className="mt-2 sm:mt-0 px-6 py-2 bg-black text-white font-medium rounded-r hover:bg-gray-800 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
