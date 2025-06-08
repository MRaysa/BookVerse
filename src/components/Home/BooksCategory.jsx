import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import ReactStars from "react-rating-stars-component";
import { useTheme } from "../../contexts/ThemeContext";
import api from "../../api/api";
import {
  FaBookOpen,
  FaBook,
  FaCompass,
  FaExclamationTriangle,
} from "react-icons/fa";

const BooksCategory = () => {
  const { id: categoryName } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState({
    isLoading: true,
    message: "Loading books...",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeoutId;

    const fetchBooks = async () => {
      try {
        setLoading({ isLoading: true, message: "Loading books..." });
        setError(null);

        const response = await api.get(
          `/api/books/category/${encodeURIComponent(categoryName)}`
        );

        // Clear any pending timeout
        if (timeoutId) clearTimeout(timeoutId);

        if (response.data && Array.isArray(response.data.data)) {
          setBooks(response.data.data);
        } else {
          setBooks([]);
        }

        setLoading({ isLoading: false, message: "" });
      } catch (err) {
        // Clear any pending timeout
        if (timeoutId) clearTimeout(timeoutId);

        console.error("Error fetching books:", err);

        if (err.response) {
          if (err.response.status === 404) {
            setBooks([]);
          } else {
            setError(err.response.data?.message || "Failed to fetch books");
          }
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError(err.message || "An unexpected error occurred");
        }

        setLoading({ isLoading: false, message: "" });
      }
    };

    // Set timeout only if the request takes too long
    timeoutId = setTimeout(() => {
      if (loading.isLoading) {
        setError("Request is taking longer than expected...");
        setLoading({ isLoading: false, message: "" });
      }
    }, 8000);

    fetchBooks();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [categoryName]);
  const handleDetailsClick = (bookId) => {
    navigate(`/book-details/${bookId}`);
  };

  // Loading state
  if (loading.isLoading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        } p-8`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p
          className={`text-lg ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {loading.message}
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        } p-8`}
      >
        <div
          className={`p-4 rounded-full mb-4 ${
            theme === "dark" ? "bg-red-900/30" : "bg-red-100"
          }`}
        >
          <FaExclamationTriangle className="text-4xl text-red-500" />
        </div>
        <h2
          className={`text-2xl font-bold mb-2 ${
            theme === "dark" ? "text-red-400" : "text-red-600"
          }`}
        >
          Error Loading Books
        </h2>
        <p
          className={`max-w-md text-center mb-6 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {error}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-2 rounded-md ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className={`px-6 py-2 rounded-md ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            Go Home
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center justify-center py-16 px-4 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg text-center`}
          >
            <div
              className={`p-5 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              } mb-6`}
            >
              <FaBook
                className={`text-5xl ${
                  theme === "dark" ? "text-purple-400" : "text-purple-500"
                }`}
              />
            </div>
            <h3
              className={`text-2xl font-semibold mb-3 ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              No Books Found in This Category
            </h3>
            <p
              className={`max-w-md mb-6 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We couldn't find any books matching the "
              {decodeURIComponent(categoryName)}" category. Our library is
              constantly expanding, so please check back later.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <button
                onClick={() => navigate("/")}
                className={`px-6 py-3 rounded-lg flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white transition-colors`}
              >
                <FaCompass className="mr-2" />
                Explore Other Categories
              </button>
              <button
                onClick={() => navigate("/all-books")}
                className={`px-6 py-3 rounded-lg flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                } transition-colors`}
              >
                <FaBookOpen className="mr-2" />
                View All Books
              </button>
            </div>
          </motion.div>
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
