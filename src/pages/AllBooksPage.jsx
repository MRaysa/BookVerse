import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "../api/api";
import BookCard from "../components/BookCard";
import BookTable from "../components/BookTable";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'
  const [showAvailable, setShowAvailable] = useState(false);
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/books?available=${showAvailable}`
        );
        setBooks(response.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch books");
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [showAvailable]);

  const handleUpdate = (bookId) => {
    navigate(`/update-book/${bookId}`);
  };

  const handleViewDetails = (bookId) => {
    navigate(`/book-details/${bookId}`);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } p-8`}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } p-8`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              All Books
            </h1>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAvailable(!showAvailable)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  showAvailable
                    ? theme === "dark"
                      ? "bg-green-700 text-white"
                      : "bg-green-600 text-white"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {showAvailable ? "Show All" : "Show Available"}
              </button>

              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className={`px-4 py-2 rounded-md border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                <option value="card">Card View</option>
                <option value="table">Table View</option>
              </select>
            </div>
          </div>
        </motion.div>

        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-8 rounded-lg text-center ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No books found. {showAvailable && "Try showing all books."}
            </p>
          </motion.div>
        ) : viewMode === "card" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {books.map((book) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BookTable
              books={books}
              onUpdate={user ? handleUpdate : null}
              onViewDetails={handleViewDetails}
              theme={theme}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllBooksPage;
