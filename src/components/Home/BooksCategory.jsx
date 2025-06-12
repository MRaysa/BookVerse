import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import api from "../../api/api";
import {
  FaBookOpen,
  FaBook,
  FaCompass,
  FaExclamationTriangle,
  FaSearch,
  FaArrowLeft,
  FaFilter,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const BooksCategory = () => {
  const { id: categoryName } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState({
    isLoading: true,
    message: "Loading books...",
  });
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    availability: "all",
  });

  // Function to render star rating icons
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  useEffect(() => {
    let timeoutId;

    const fetchBooks = async () => {
      try {
        setLoading({ isLoading: true, message: "Loading books..." });
        setError(null);

        const response = await api.get(
          `/api/books/category/${encodeURIComponent(categoryName)}`
        );

        if (timeoutId) clearTimeout(timeoutId);

        if (response.data && Array.isArray(response.data.data)) {
          setBooks(response.data.data);
          setFilteredBooks(response.data.data);
        } else {
          setBooks([]);
          setFilteredBooks([]);
        }

        setLoading({ isLoading: false, message: "" });
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);

        console.error("Error fetching books:", err);

        if (err.response) {
          if (err.response.status === 404) {
            setBooks([]);
            setFilteredBooks([]);
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

  useEffect(() => {
    let results = books;

    // Apply search filter
    if (searchQuery) {
      results = results.filter(
        (book) =>
          book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      results = results.filter((book) => book.rating >= filters.minRating);
    }

    // Apply availability filter
    if (filters.availability === "available") {
      results = results.filter((book) => book.quantity > 0);
    } else if (filters.availability === "unavailable") {
      results = results.filter((book) => book.quantity <= 0);
    }

    setFilteredBooks(results);
  }, [searchQuery, filters, books]);

  const handleDetailsClick = (bookId) => {
    navigate(`/book-details/${bookId}`);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      minRating: 0,
      availability: "all",
    });
  };

  // Loading state
  if (loading.isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen flex flex-col items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        } p-8`}
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
          className="relative w-24 h-24 mb-8"
        >
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-4 border-t-purple-300 border-r-purple-300 border-b-transparent border-l-transparent animate-spin animation-delay-200"></div>
          <div className="absolute inset-8 rounded-full border-4 border-t-purple-200 border-r-purple-200 border-b-transparent border-l-transparent animate-spin animation-delay-400"></div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-lg ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {loading.message}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.6 }}
          className={`text-sm mt-2 ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Exploring the {decodeURIComponent(categoryName)} collection...
        </motion.p>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen flex flex-col items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        } p-8`}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`p-6 rounded-2xl mb-6 ${
            theme === "dark" ? "bg-red-900/20" : "bg-red-100/80"
          } backdrop-blur-sm`}
        >
          <FaExclamationTriangle className="text-5xl text-red-500 animate-pulse" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-bold mb-4 ${
            theme === "dark" ? "text-red-400" : "text-red-600"
          }`}
        >
          Error Loading Books
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`max-w-md text-center mb-8 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {error}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white shadow-lg transition-all`}
          >
            <FaCompass className="animate-spin" />
            Try Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } ${
              theme === "dark" ? "text-white" : "text-gray-800"
            } shadow-lg transition-all`}
          >
            <FaArrowLeft />
            Go Home
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } p-4 md:p-8`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className={`p-2 rounded-full ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <FaArrowLeft
                className={theme === "dark" ? "text-white" : "text-gray-800"}
              />
            </motion.button>
            <motion.h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              {decodeURIComponent(categoryName)} Books
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`ml-2 text-sm font-normal ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                ({filteredBooks.length}{" "}
                {filteredBooks.length === 1 ? "book" : "books"})
              </motion.span>
            </motion.h1>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3 w-full md:w-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`relative flex-1 md:w-64 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-md`}
            >
              <FaSearch
                className={`absolute left-3 top-3 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-800 text-white focus:ring-purple-600"
                    : "bg-white text-gray-800 focus:ring-purple-400"
                }`}
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <IoMdClose />
                </motion.button>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg flex items-center gap-2 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <FaFilter
                className={
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }
              />
              <span
                className={`hidden md:block ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Filters
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 overflow-hidden rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3
                    className={`font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Minimum Rating
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setFilters({
                              ...filters,
                              minRating: filters.minRating === star ? 0 : star,
                            })
                          }
                          className="focus:outline-none"
                        >
                          {star <= filters.minRating ? (
                            <FaStar className="text-yellow-400 text-xl" />
                          ) : (
                            <FaRegStar className="text-yellow-400 text-xl" />
                          )}
                        </button>
                      ))}
                    </div>
                    <span
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3
                    className={`font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Availability
                  </h3>
                  <div className="flex gap-4">
                    {["all", "available", "unavailable"].map((option) => (
                      <motion.button
                        key={option}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setFilters({ ...filters, availability: option })
                        }
                        className={`px-4 py-2 rounded-lg capitalize ${
                          filters.availability === option
                            ? theme === "dark"
                              ? "bg-purple-600 text-white"
                              : "bg-purple-500 text-white"
                            : theme === "dark"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className={`px-4 py-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    } ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    } shadow-md`}
                  >
                    Reset Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center justify-center py-16 px-4 rounded-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-2xl text-center`}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`p-6 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              } mb-6 shadow-inner`}
            >
              <FaBook
                className={`text-6xl ${
                  theme === "dark" ? "text-purple-400" : "text-purple-500"
                }`}
              />
            </motion.div>
            <h3
              className={`text-2xl font-semibold mb-3 ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {searchQuery ||
              filters.minRating > 0 ||
              filters.availability !== "all"
                ? "No Matching Books Found"
                : "No Books Found in This Category"}
            </h3>
            <p
              className={`max-w-md mb-8 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {searchQuery ||
              filters.minRating > 0 ||
              filters.availability !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : `We couldn't find any books matching the "${decodeURIComponent(
                    categoryName
                  )}" category. Our library is constantly expanding, so please check back later.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className={`px-6 py-3 rounded-xl flex items-center justify-center gap-2 ${
                  theme === "dark"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white shadow-lg transition-all`}
              >
                <FaCompass className="animate-pulse" />
                Explore Other Categories
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetFilters();
                  setSearchQuery("");
                }}
                className={`px-6 py-3 rounded-xl flex items-center justify-center gap-2 ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                } shadow-lg transition-all`}
              >
                <FaBookOpen />
                Reset Filters
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    y: -5,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className={`rounded-xl overflow-hidden ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } shadow-lg relative group`}
                >
                  {/* Book Ribbon for Availability */}
                  {book.quantity <= 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-bold transform rotate-12 translate-x-2 -translate-y-1 z-10 shadow-md">
                      Out of Stock
                    </div>
                  )}

                  {/* Book Image */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="h-56 overflow-hidden relative"
                  >
                    <img
                      src={
                        book.image ||
                        "https://via.placeholder.com/300x400?text=No+Image"
                      }
                      alt={book.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white text-sm line-clamp-2"
                      >
                        {book.description || "No description available"}
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Book Details */}
                  <div className="p-5">
                    <h3
                      className={`text-xl font-bold mb-1 truncate ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {book.name}
                    </h3>
                    <p
                      className={`mb-3 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      by {book.author}
                    </p>

                    {/* Rating with star icons */}
                    <div className="flex items-center mb-3 gap-2">
                      <div className="flex">
                        {renderStarRating(book.rating)}
                      </div>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        ({book.rating.toFixed(1)})
                      </span>
                    </div>

                    {/* Availability */}
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          book.quantity > 0
                            ? theme === "dark"
                              ? "bg-green-900/30 text-green-400"
                              : "bg-green-100 text-green-800"
                            : theme === "dark"
                            ? "bg-red-900/30 text-red-400"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.quantity > 0
                          ? `${book.quantity} available`
                          : "Out of stock"}
                      </span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {book.pages} pages
                      </span>
                    </div>

                    {/* Details Button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleDetailsClick(book._id)}
                      className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                        theme === "dark"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-purple-500 hover:bg-purple-600"
                      } text-white shadow-md transition-all`}
                    >
                      <FaBookOpen className="text-sm" />
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BooksCategory;
