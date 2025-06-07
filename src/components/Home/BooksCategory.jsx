import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import ReactStars from "react-rating-stars-component";
import { useTheme } from "../../contexts/ThemeContext";
import api from "../../api/api";

const BooksCategory = () => {
  const { id: categoryName } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/api/books/category/${encodeURIComponent(categoryName)}`
        );
        setBooks(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [categoryName]);

  const handleDetailsClick = (bookId) => {
    navigate(`/book-details/${bookId}`);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        } p-8`}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        } p-8`}
      >
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            Error: {error}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className={`mt-4 px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } p-8`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className={`text-3xl font-bold mb-8 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {decodeURIComponent(categoryName)} Books
        </motion.h1>

        {books.length === 0 ? (
          <div className="text-center py-12">
            <h3
              className={`text-xl ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No books found in the {decodeURIComponent(categoryName)} category.
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`rounded-lg overflow-hidden shadow-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {book.name}
                  </h3>
                  <p
                    className={`mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    by {book.author}
                  </p>
                  <div className="flex items-center mb-2">
                    <ReactStars
                      count={5}
                      value={book.rating}
                      size={24}
                      activeColor={theme === "dark" ? "#a78bfa" : "#8b5cf6"}
                      edit={false}
                    />
                    <span
                      className={`ml-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      ({book.rating.toFixed(1)})
                    </span>
                  </div>
                  <p
                    className={`mb-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Available: {book.quantity}
                  </p>
                  <button
                    onClick={() => handleDetailsClick(book._id)}
                    className={`w-full py-2 px-4 rounded-md ${
                      theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksCategory;
