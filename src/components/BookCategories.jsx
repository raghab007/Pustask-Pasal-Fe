import { Link } from "react-router";
import { BookOpen } from "lucide-react";

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

const BookCategories = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Explore by Category</h2>
          <p className="mt-2 text-lg text-gray-600">
            Discover books from your favorite genres
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {GENRES.map((genre) => (
            <Link
              key={genre}
              to={`/books?genre=${genre}`}
              className="group bg-white rounded-lg shadow-md p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-800 transition-colors duration-200">
                  <BookOpen size={24} className="text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-black">
                  {genre.replace(/_/g, " ")}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookCategories; 