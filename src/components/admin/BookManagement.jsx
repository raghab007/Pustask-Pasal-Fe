import { useState, useEffect } from "react";
import {
  BookOpen,
  Box,
  Plus,
  ShoppingCart,
  Star,
  Upload,
  X,
  UserPlus,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const BookStatistics = ({ stats }) => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white overflow-hidden shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-black rounded-md p-3 text-white">
                  {item.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {item.stat}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BooksList = ({ books, setIsAddingBook, setSelectedBook, fetchBooks }) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Books Inventory</h2>
        <button
          onClick={() => {
            setSelectedBook(null);
            setIsAddingBook(true);
          }}
          className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add New Book
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Authors
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ISBN
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          {books?.length > 0 ? (
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                        {book.frontImage ? (
                          <img
                            src={`http://localhost:5001/api/Images/Books/${book.frontImage}`}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-100">
                            <BookOpen size={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {book.title}
                        </div>
                        {book.isBestSeller && (
                          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">
                      {book.authors?.map((author) => author.name).join(", ")}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                    {book.isbn}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Rs {book.price}
                    </div>
                    {book.isOnSale && (
                      <div className="text-xs text-red-600 font-medium">
                        On Sale
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        book.stock < 5
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {book.stock} in stock
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedBook(book);
                        setIsAddingBook(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this book?"
                          )
                        ) {
                          await axios.delete(
                            `http://localhost:5001/api/Books/${book.id}`
                          );
                          fetchBooks();
                        }
                      }}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <BookOpen size={48} className="text-gray-400 mb-2" />
                    <p className="text-lg">No books found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

const BookForm = ({ book = null, onSave, onCancel, fetchBooks }) => {
  const isEditing = !!book;

  const [formData, setFormData] = useState({
    title: book?.title || "",
    isbn: book?.isbn || "",
    description: book?.description || "",
    price: book?.price || 0,
    stock: book?.stock || 0,
    publishedDate: book?.publishedDate
      ? new Date(book.publishedDate).toISOString().split("T")[0]
      : "",
    publisher: book?.publisher || "",
    releaseStatus: book?.releaseStatus || "Released",
    isOnSale: book?.isOnSale || false,
    isBestSeller: book?.isBestSeller || false,
    discountStartDate: book?.discountStartDate
      ? new Date(book.discountStartDate).toISOString().split("T")[0]
      : "",
    discountEndDate: book?.discountEndDate
      ? new Date(book.discountEndDate).toISOString().split("T")[0]
      : "",
    authors: book?.authors || [{ name: "", bio: "" }],
    genres: book?.genres?.map((g) => g.genreType) || [],
  });

  const [frontImageFile, setFrontImageFile] = useState(null);
  const [backImageFile, setBackImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const genreOptions = [
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...formData.authors];
    updatedAuthors[index][field] = value;
    setFormData({
      ...formData,
      authors: updatedAuthors,
    });
  };

  const addAuthor = () => {
    setFormData({
      ...formData,
      authors: [...formData.authors, { name: "", bio: "" }],
    });
  };

  const removeAuthor = (index) => {
    if (formData.authors.length <= 1) return;
    const updatedAuthors = [...formData.authors];
    updatedAuthors.splice(index, 1);
    setFormData({
      ...formData,
      authors: updatedAuthors,
    });
  };

  const handleFileChange = (e, imageType) => {
    const file = e.target.files[0];
    if (imageType === "front") {
      setFrontImageFile(file);
    } else {
      setBackImageFile(file);
    }
  };

  const handleGenreChange = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const addGenre = () => {
    setFormData({
      ...formData,
      genres: [...formData.genres, ""],
    });
  };

  const removeGenre = (index) => {
    if (formData.genres.length <= 1) return;
    const updatedGenres = [...formData.genres];
    updatedGenres.splice(index, 1);
    setFormData({
      ...formData,
      genres: updatedGenres,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append book data with proper type conversion
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("ISBN", formData.isbn);
      formDataToSend.append("Description", formData.description || "");
      formDataToSend.append("Price", parseFloat(formData.price));
      formDataToSend.append("Stock", parseInt(formData.stock));
      if (formData.publishedDate) {
        formDataToSend.append(
          "PublishedDate",
          new Date(formData.publishedDate).toISOString()
        );
      }
      formDataToSend.append("Publisher", formData.publisher || "");
      formDataToSend.append("ReleaseStatus", formData.releaseStatus);
      formDataToSend.append("IsOnSale", formData.isOnSale);
      formDataToSend.append("IsBestSeller", formData.isBestSeller);

      // Append genres
      formData.genres.forEach((genre, index) => {
        formDataToSend.append(`Genres[${index}].GenreType`, genre);
      });

      if (formData.isOnSale) {
        if (formData.discountStartDate) {
          formDataToSend.append(
            "DiscountStartDate",
            new Date(formData.discountStartDate).toISOString()
          );
        }
        if (formData.discountEndDate) {
          formDataToSend.append(
            "DiscountEndDate",
            new Date(formData.discountEndDate).toISOString()
          );
        }
      }

      // Append authors with validation
      formData.authors.forEach((author, index) => {
        if (author.name) {  // Only append if name exists
          formDataToSend.append(`Authors[${index}].Name`, author.name);
          if (author.bio) {
            formDataToSend.append(`Authors[${index}].Bio`, author.bio);
          }
        }
      });

      // Only append files if they are new
      if (frontImageFile) formDataToSend.append("FrontImage", frontImageFile);
      if (backImageFile) formDataToSend.append("BackImage", backImageFile);

      // Log the data being sent
      console.log('Form data being sent:', {
        title: formData.title,
        isbn: formData.isbn,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        genres: formData.genres,
        authors: formData.authors,
        isOnSale: formData.isOnSale,
        isBestSeller: formData.isBestSeller,
        description: formData.description || "",
        publisher: formData.publisher || ""
      });

      let response;
      if (isEditing) {
        // Update existing book
        console.log('Updating book with ID:', book.id);
        response = await axios.put(
          `http://localhost:5001/api/Books/${book.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Add new book
        response = await axios.post(
          "http://localhost:5001/api/Books",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      fetchBooks();
      onSave();
    } catch (error) {
      console.error("Error saving book:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      console.error("Error response headers:", error.response?.headers);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit Book" : "Add New Book"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          type="button"
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="isbn"
                className="block text-sm font-medium text-gray-700"
              >
                ISBN *
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authors *
              </label>
              {formData.authors.map((author, index) => (
                <div key={index} className="mb-4 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Author Name"
                      value={author.name}
                      onChange={(e) =>
                        handleAuthorChange(index, "name", e.target.value)
                      }
                      required
                      className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                      disabled={isLoading}
                    />
                    {formData.authors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAuthor(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={isLoading}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  <textarea
                    placeholder="Author Bio"
                    value={author.bio}
                    onChange={(e) =>
                      handleAuthorChange(index, "bio", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    disabled={isLoading}
                    rows="2"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addAuthor}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                disabled={isLoading}
              >
                <Plus size={14} className="mr-1" />
                Add Another Author
              </button>
            </div>

            <div>
              <label
                htmlFor="publishedDate"
                className="block text-sm font-medium text-gray-700"
              >
                Published Date
              </label>
              <input
                type="date"
                id="publishedDate"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="publisher"
                className="block text-sm font-medium text-gray-700"
              >
                Publisher
              </label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genres *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {genreOptions.map((genre) => (
                  <div key={genre} className="flex items-center">
                    <input
                      type="checkbox"
                      id={genre}
                      checked={formData.genres.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={genre}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {genre.replace(/_/g, " ")}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stock *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                disabled={isLoading}
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="releaseStatus"
                className="block text-sm font-medium text-gray-700"
              >
                Release Status
              </label>
              <select
                id="releaseStatus"
                name="releaseStatus"
                value={formData.releaseStatus}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                disabled={isLoading}
              >
                <option value="Released">Released</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Out of Print">Out of Print</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isBestSeller"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label
                  htmlFor="isBestSeller"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Best Seller
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOnSale"
                  name="isOnSale"
                  checked={formData.isOnSale}
                  onChange={handleChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label
                  htmlFor="isOnSale"
                  className="ml-2 block text-sm text-gray-700"
                >
                  On Sale
                </label>
              </div>
            </div>

            {formData.isOnSale && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="discountStartDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sale Start Date
                  </label>
                  <input
                    type="date"
                    id="discountStartDate"
                    name="discountStartDate"
                    value={formData.discountStartDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="discountEndDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sale End Date
                  </label>
                  <input
                    type="date"
                    id="discountEndDate"
                    name="discountEndDate"
                    value={formData.discountEndDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Front Cover Image *
                </label>
                <div className="flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="flex items-center justify-center">
                    <BookOpen size={24} className="text-gray-400 mr-2" />
                    <Upload size={24} className="text-gray-400" />
                  </div>
                  <div className="flex text-sm text-gray-600 mt-2">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "front")}
                        className="sr-only"
                        disabled={isLoading}
                        required={!isEditing} // Only required when adding new book
                      />
                    </label>
                  </div>
                  {frontImageFile && (
                    <p className="mt-2 text-xs text-gray-500">
                      Selected: {frontImageFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Back Cover Image *
                </label>
                <div className="flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="flex items-center justify-center">
                    <BookOpen size={24} className="text-gray-400 mr-2" />
                    <Upload size={24} className="text-gray-400" />
                  </div>
                  <div className="flex text-sm text-gray-600 mt-2">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "back")}
                        className="sr-only"
                        disabled={isLoading}
                        required={!isEditing} // Only required when adding new book
                      />
                    </label>
                  </div>
                  {backImageFile && (
                    <p className="mt-2 text-xs text-gray-500">
                      Selected: {backImageFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : isEditing ? (
              <>
                <Star size={16} className="mr-2" />
                Update Book
              </>
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Add Book
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState([
    {
      id: 1,
      name: "Total Reviews",
      stat: "0",
      icon: <MessageSquare size={20} />,
    },
    {
      id: 2,
      name: "Positive Reviews",
      stat: "0",
      icon: <ThumbsUp size={20} />,
    },
    {
      id: 3,
      name: "Negative Reviews",
      stat: "0",
      icon: <ThumbsDown size={20} />,
    },
    { id: 4, name: "Average Rating", stat: "0", icon: <Star size={20} /> },
  ]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/Reviews?page=${currentPage}&pageSize=${pageSize}`
      );
      setReviews(response.data.reviews);
      setTotalPages(Math.ceil(response.data.totalCount / pageSize));

      // Update stats
      const totalReviews = response.data.totalCount;
      const positiveReviews = response.data.reviews.filter(
        (review) => review.rating >= 4
      ).length;
      const negativeReviews = response.data.reviews.filter(
        (review) => review.rating <= 2
      ).length;
      const averageRating =
        response.data.reviews.reduce((acc, review) => acc + review.rating, 0) /
        totalReviews;

      setStats([
        { ...stats[0], stat: totalReviews.toString() },
        { ...stats[1], stat: positiveReviews.toString() },
        { ...stats[2], stat: negativeReviews.toString() },
        { ...stats[3], stat: averageRating.toFixed(1) },
      ]);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`http://localhost:5001/api/Reviews/${reviewId}`);
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review");
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <BookStatistics stats={stats} />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Reviews Management
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {review.book?.frontImage ? (
                          <img
                            src={`http://localhost:5001/api/Images/Books/${review.book.frontImage}`}
                            alt={review.book.title}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                            <BookOpen size={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {review.book?.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {review.user?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {review.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {review.comment}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 py-4 border-t border-gray-200">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            Next
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState([
    { id: 1, name: "Total Orders", stat: "0", icon: <ShoppingCart size={20} /> },
    { id: 2, name: "Processing", stat: "0", icon: <Clock size={20} /> },
    { id: 3, name: "Delivered", stat: "0", icon: <CheckCircle size={20} /> },
    { id: 4, name: "Cancelled", stat: "0", icon: <X size={20} /> },
  ]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/Orders/all?page=${currentPage}&pageSize=${pageSize}`
      );
      setOrders(response.data);
      setTotalPages(Math.ceil(response.data.length / pageSize));

      // Update stats
      const totalOrders = response.data.length;
      const processingOrders = response.data.filter(
        (order) => order.order.status === "Processing"
      ).length;
      const deliveredOrders = response.data.filter(
        (order) => order.order.status === "Delivered"
      ).length;
      const cancelledOrders = response.data.filter(
        (order) => order.order.status === "Cancelled"
      ).length;

      setStats([
        { ...stats[0], stat: totalOrders.toString() },
        { ...stats[1], stat: processingOrders.toString() },
        { ...stats[2], stat: deliveredOrders.toString() },
        { ...stats[3], stat: cancelledOrders.toString() },
      ]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handleMarkAsDelivered = async (orderId) => {
    try {
      await axios.post(`http://localhost:5001/api/Orders/${orderId}/deliver`);
      fetchOrders();
    } catch (error) {
      console.error("Error marking order as delivered:", error);
      setError("Failed to mark order as delivered");
    }
  };

  const handleProcessOrder = async (orderId) => {
    try {
      await axios.post(`http://localhost:5001/api/Orders/${orderId}/process`);
      fetchOrders();
    } catch (error) {
      console.error("Error processing order:", error);
      setError("Failed to process order");
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="text-green-500" />;
      case "processing":
        return <Clock className="text-blue-500" />;
      case "cancelled":
        return <X className="text-red-500" />;
      default:
        return <AlertCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BookStatistics stats={stats} />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((orderData) => (
                <tr key={orderData.order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{orderData.order.claimCode}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(orderData.order.orderDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {orderData.user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {orderData.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(orderData.order.status)}
                      <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(orderData.order.status)}`}>
                        {orderData.order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs {orderData.order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {orderData.order.status === "Pending" && (
                        <button
                          onClick={() => handleProcessOrder(orderData.order.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Process
                        </button>
                      )}
                      {orderData.order.status === "Processing" && (
                        <button
                          onClick={() => handleMarkAsDelivered(orderData.order.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 py-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              Next
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const BooksManagement = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState([
    { id: 1, name: "Total Books", stat: "0", icon: <BookOpen size={20} /> },
    { id: 2, name: "Books Sold", stat: "0", icon: <ShoppingCart size={20} /> },
    { id: 3, name: "Low Stock", stat: "0", icon: <Box size={20} /> },
    { id: 4, name: "Best Sellers", stat: "0", icon: <Star size={20} /> },
  ]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/Books?page=${currentPage}&pageSize=${pageSize}`
      );
      setBooks(response.data.books);
      setTotalPages(Math.ceil(response.data.totalCount / pageSize));

      // Update stats based on fetched data
      setStats([
        { ...stats[0], stat: response.data.totalCount?.toString() },
        {
          ...stats[1],
          stat: response.data.books
            ?.reduce((sum, book) => sum + (book.totalSold || 0), 0)
            ?.toString(),
        },
        {
          ...stats[2],
          stat: response.data.books
            ?.filter((book) => book.stock < 5)
            .length?.toString(),
        },
        {
          ...stats[3],
          stat: response.data.books
            ?.filter((book) => book.isBestSeller)
            .length?.toString(),
        },
      ]);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage]); // Add currentPage as dependency

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSave = () => {
    setIsAddingBook(false);
    setSelectedBook(null);
    fetchBooks();
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("books")}
            className={`${
              activeTab === "books"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Books
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`${
              activeTab === "reviews"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`${
              activeTab === "orders"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Orders
          </button>
        </nav>
      </div>

      {activeTab === "books" ? (
        isAddingBook ? (
          <BookForm
            book={selectedBook}
            onSave={handleSave}
            onCancel={() => {
              setIsAddingBook(false);
              setSelectedBook(null);
            }}
            fetchBooks={fetchBooks}
          />
        ) : (
          <>
            <BookStatistics stats={stats} />
            <BooksList
              books={books}
              setIsAddingBook={setIsAddingBook}
              setSelectedBook={setSelectedBook}
              fetchBooks={fetchBooks}
            />

            {/* Enhanced Pagination Controls */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Next
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </>
        )
      ) : activeTab === "reviews" ? (
        <ReviewsManagement />
      ) : (
        <OrdersManagement />
      )}
    </div>
  );
};
