import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "../api/api";
import BookCard from "../components/BookCard";
import BookTable from "../components/BookTable";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card");
  const [showAvailable, setShowAvailable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: `0px 5px 15px ${
        theme === "dark" ? "rgba(59, 130, 246, 0.4)" : "rgba(0, 0, 0, 0.1)"
      }`,
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.98 },
  };

  // Extract unique categories from books
  const categories = ["all", ...new Set(books.map((book) => book.category))];

  // Filter books based on search term, availability, and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailable = !showAvailable || book.quantity > 0;
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;

    return matchesSearch && matchesAvailable && matchesCategory;
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/books");
        setBooks(response.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch books");
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleUpdate = (bookId) => {
    navigate(`/update-book/${bookId}`);
  };

  const handleViewDetails = (bookId) => {
    navigate(`/book-details/${bookId}`);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className={`p-6 rounded-full ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <svg
            className="w-12 h-12 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
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
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } p-4 md:p-8`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1
                className={`text-3xl md:text-4xl font-bold ${
                  theme === "dark" ? "text-white" : "text-blue-800"
                } mb-2`}
              >
                Explore Our Library
              </h1>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {filteredBooks.length} books waiting to be discovered
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                onClick={() => setShowAvailable(!showAvailable)}
                className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                  showAvailable
                    ? theme === "dark"
                      ? "bg-blue-700 text-white"
                      : "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {showAvailable ? "Show All" : "Show Available"}
              </motion.button>

              <motion.div whileHover={{ scale: 1.03 }} className="relative">
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className={`px-4 py-2 rounded-md border appearance-none cursor-pointer ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  } pr-8`}
                >
                  <option value="card">Card View</option>
                  <option value="table">Table View</option>
                </select>
                <div
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  ▼
                </div>
              </motion.div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-4 rounded-lg mb-6 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Search Books
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title or author..."
                    className={`w-full px-4 py-2 pl-10 rounded-md border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  />
                  <div
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Books Display Section */}
        <AnimatePresence>
          {filteredBooks.length === 0 ? (
            <motion.div
              key="no-books"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`p-8 rounded-lg text-center ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <div className="mb-4">
                <svg
                  className={`w-16 h-16 mx-auto ${
                    theme === "dark" ? "text-gray-600" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p
                className={`text-lg ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                } mb-2`}
              >
                No books found matching your criteria
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {showAvailable &&
                  "Try showing all books or changing your search."}
              </p>
            </motion.div>
          ) : viewMode === "card" ? (
            <motion.div
              key="card-view"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredBooks.map((book) => (
                <motion.div
                  key={book._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  layout
                >
                  <BookCard
                    book={book}
                    onUpdate={user ? () => handleUpdate(book._id) : null}
                    onViewDetails={() => handleViewDetails(book._id)}
                    theme={theme}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="table-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`rounded-lg overflow-hidden shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <BookTable
                books={filteredBooks}
                onUpdate={user ? handleUpdate : null}
                onViewDetails={handleViewDetails}
                theme={theme}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Add Button (for authenticated users) */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-6 right-6"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/add-book")}
              className={`p-4 rounded-full shadow-lg ${
                theme === "dark" ? "bg-blue-600" : "bg-blue-500"
              } text-white`}
              aria-label="Add new book"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AllBooksPage;
