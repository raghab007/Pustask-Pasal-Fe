import { Link } from "react-router";
import { BookOpen } from "lucide-react";

const Categories = () => {
  const genres = [
    "THRILLER",
    "FANTASY",
    "ROMANCE",
    "COMEDY",
    "ADVENTURE",
    "MYSTHERY",
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Categories</h1>
        <p className="text-lg text-gray-600">
          Explore our wide range of book categories and find your next favorite read
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {genres.map((genre) => (
          <Link
            key={genre}
            to={`/books?genre=${genre}`}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-black rounded-lg mb-4 group-hover:bg-gray-800 transition-colors duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {genre.replace(/_/g, " ")}
              </h3>
              <p className="text-gray-600 text-sm">
                Explore our collection of {genre.replace(/_/g, " ").toLowerCase()} books
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories; 