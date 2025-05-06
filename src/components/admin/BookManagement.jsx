import { useState } from "react";
import { BookOpen, Box, Plus, ShoppingCart, Star, Upload } from "lucide-react";
import { useOutletContext } from "react-router";

export const BookStatistics = () => {
  const stats = [
    { id: 1, name: "Total Books", stat: "243", icon: <BookOpen size={20} /> },
    {
      id: 2,
      name: "Books Sold This Month",
      stat: "56",
      icon: <ShoppingCart size={20} />,
    },
    { id: 3, name: "Low Stock Alert", stat: "12", icon: <Box size={20} /> },
    { id: 4, name: "Best Sellers", stat: "18", icon: <Star size={20} /> },
  ];

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

export const BooksList = ({ books, setIsAddingBook, setSelectedBook }) => {
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
              ISBN
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              Publisher
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              Price
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              Stock
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              Status
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-gray-50">
              <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center">
                    <BookOpen size={16} className="text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {book.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {book.authors.join(", ")}
                      {book.isBestSeller && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Bestseller
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                {book.isbn}
              </td>
              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                {book.publisher}
              </td>
              <td className="py-4 px-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${book.price}</div>
                {book.isOnSale && (
                  <div className="text-xs text-red-600">On Sale</div>
                )}
              </td>
              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                {book.quantity}
              </td>
              <td className="py-4 px-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {book.releaseStatus}
                </span>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BookForm = ({ book = null, addBook, updateBook, onCancel }) => {
  const isEditing = !!book;

  const [formData, setFormData] = useState({
    id: book?.id || crypto.randomUUID(),
    title: book?.title || "",
    isbn: book?.isbn || "",
    publishedDate: book?.publishedDate || "",
    publisher: book?.publisher || "",
    price: book?.price || "",
    quantity: book?.quantity || "",
    totalSold: book?.totalSold || 0,
    totalRating: book?.totalRating || 0,
    description: book?.description || "",
    totalReviews: book?.totalReviews || "0",
    releaseStatus: book?.releaseStatus || "Published",
    isOnSale: book?.isOnSale || false,
    isBestSeller: book?.isBestSeller || false,
    discountStartDate: book?.discountStartDate || "",
    discountEndDate: book?.discountEndDate || "",
    authors: book?.authors?.join(", ") || "",
    frontCover: book?.frontCover || null,
    backCover: book?.backCover || null,
  });

  const [frontCoverPreview, setFrontCoverPreview] = useState(
    book?.frontCover || null
  );
  const [backCoverPreview, setBackCoverPreview] = useState(
    book?.backCover || null
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e, coverType) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (coverType === "front") {
        setFrontCoverPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          frontCover: reader.result,
        }));
      } else {
        setBackCoverPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          backCover: reader.result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (coverType) => {
    if (coverType === "front") {
      setFrontCoverPreview(null);
      setFormData((prev) => ({
        ...prev,
        frontCover: null,
      }));
    } else {
      setBackCoverPreview(null);
      setFormData((prev) => ({
        ...prev,
        backCover: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Process the authors string into an array
    const processedData = {
      ...formData,
      authors: formData.authors
        .split(",")
        .map((author) => author.trim())
        .filter((author) => author),
    };

    if (isEditing) {
      updateBook(processedData);
    } else {
      addBook(processedData);
    }
    onCancel();
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
              />
            </div>

            <div>
              <label
                htmlFor="authors"
                className="block text-sm font-medium text-gray-700"
              >
                Authors (comma separated) *
              </label>
              <input
                type="text"
                id="authors"
                name="authors"
                value={formData.authors}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="publishedDate"
                className="block text-sm font-medium text-gray-700"
              >
                Published Date *
              </label>
              <input
                type="date"
                id="publishedDate"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="publisher"
                className="block text-sm font-medium text-gray-700"
              >
                Publisher *
              </label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (USD) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
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
              >
                <option value="Published">Published</option>
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
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Front Cover Image
                </label>
                <div className="flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {frontCoverPreview ? (
                    <div className="relative">
                      <img
                        src={frontCoverPreview}
                        alt="Front Cover Preview"
                        className="h-32 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("front")}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="mx-auto text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="front-cover-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black"
                        >
                          <span>Upload a file</span>
                          <input
                            id="front-cover-upload"
                            name="frontCover"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "front")}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Back Cover Image
                </label>
                <div className="flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {backCoverPreview ? (
                    <div className="relative">
                      <img
                        src={backCoverPreview}
                        alt="Back Cover Preview"
                        className="h-32 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("back")}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="mx-auto text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="back-cover-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black"
                        >
                          <span>Upload a file</span>
                          <input
                            id="back-cover-upload"
                            name="backCover"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "back")}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            {isEditing ? "Update Book" : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export const BooksManagement = () => {
  const { books, addBook, updateBook } = useOutletContext();
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <>
      {isAddingBook ? (
        <BookForm
          book={selectedBook}
          addBook={addBook}
          updateBook={updateBook}
          onCancel={() => {
            setIsAddingBook(false);
            setSelectedBook(null);
          }}
        />
      ) : (
        <>
          <BookStatistics />
          <BooksList
            books={books}
            setIsAddingBook={setIsAddingBook}
            setSelectedBook={setSelectedBook}
          />
        </>
      )}
    </>
  );
};
