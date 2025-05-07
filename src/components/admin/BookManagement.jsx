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
} from "lucide-react";
import axios from "axios";

const BookStatistics = ({ stats }) => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                  {item.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
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
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Books Inventory</h2>
        <button
          onClick={() => {
            setSelectedBook(null);
            setIsAddingBook(true);
          }}
          className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <Plus size={18} className="mr-2" />
          Add New Book
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              Title
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              Authors
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              ISBN
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              Price
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              Stock
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              Actions
            </th>
          </tr>
        </thead>
        {books?.length > 0 ? (
          <tbody className="divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center">
                      {book.frontImage ? (
                        <img
                          src={`http://localhost:5001/api/Images/Books/${book.frontImage}`}
                          alt={book.title}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <BookOpen size={16} className="text-gray-600" />
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
                  <div className="text-sm text-gray-900">Rs {book.price}</div>
                  {book.isOnSale && (
                    <div className="text-xs text-red-600">On Sale</div>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                  {book.stock}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setIsAddingBook(true);
                    }}
                    className="text-gray-600 hover:text-gray-900 mr-3"
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
                    className="text-red-600 hover:text-red-900"
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
              <td colSpan="6" className="py-4 text-center text-gray-500">
                No books found
              </td>
            </tr>
          </tbody>
        )}
      </table>
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
  });

  const [frontImageFile, setFrontImageFile] = useState(null);
  const [backImageFile, setBackImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append book data
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("ISBN", formData.isbn);
      formDataToSend.append("Description", formData.description);
      formDataToSend.append("Price", formData.price);
      formDataToSend.append("Stock", formData.stock);
      if (formData.publishedDate) {
        formDataToSend.append("PublishedDate", formData.publishedDate);
      }
      formDataToSend.append("Publisher", formData.publisher);
      formDataToSend.append("ReleaseStatus", formData.releaseStatus);
      formDataToSend.append("IsOnSale", formData.isOnSale);
      formDataToSend.append("IsBestSeller", formData.isBestSeller);

      if (formData.isOnSale) {
        formDataToSend.append("DiscountStartDate", formData.discountStartDate);
        formDataToSend.append("DiscountEndDate", formData.discountEndDate);
      }

      // Append authors as JSON strings
      formData.authors.forEach((author, index) => {
        formDataToSend.append(`Authors[${index}].Name`, author.name);
        if (author.bio) {
          formDataToSend.append(`Authors[${index}].Bio`, author.bio);
        }
      });

      // Append files if they exist
      if (frontImageFile) formDataToSend.append("FrontImage", frontImageFile);
      if (backImageFile) formDataToSend.append("BackImage", backImageFile);

      let response;
      if (isEditing) {
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

export const BooksManagement = () => {
  const [books, setBooks] = useState([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [stats, setStats] = useState([
    { id: 1, name: "Total Books", stat: "0", icon: <BookOpen size={20} /> },
    { id: 2, name: "Books Sold", stat: "0", icon: <ShoppingCart size={20} /> },
    { id: 3, name: "Low Stock", stat: "0", icon: <Box size={20} /> },
    { id: 4, name: "Best Sellers", stat: "0", icon: <Star size={20} /> },
  ]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/Books");
      setBooks(response.data.books);

      // Update stats based on fetched data
      setStats([
        { ...stats[0], stat: response.data.books.length?.toString() },
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
  }, []);

  const handleSave = () => {
    setIsAddingBook(false);
    setSelectedBook(null);
    fetchBooks();
  };

  return (
    <div className="space-y-6">
      {isAddingBook ? (
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
        </>
      )}
    </div>
  );
};
