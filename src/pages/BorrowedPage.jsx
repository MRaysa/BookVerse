import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "../api/api";
import { toast } from "react-hot-toast";
import { format, differenceInDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import {
  FaBook,
  FaArrowRight,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { RiBookmarkFill } from "react-icons/ri";

const BorrowedPage = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await axios.get("/api/borrowed", {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });
        setBorrowedBooks(response.data.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch borrowed books"
        );
        console.error("Error fetching borrowed books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [user]);

  const handleReturn = async (borrowId) => {
    try {
      setReturningId(borrowId);

      const response = await axios.post(`/api/return/${borrowId}`, null, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (response.data.success) {
        setBorrowedBooks((prev) =>
          prev.filter((book) => book._id !== borrowId)
        );
        toast.success("Book returned successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  const getDueStatus = (returnDate) => {
    const daysRemaining = differenceInDays(new Date(returnDate), new Date());
    if (daysRemaining < 0)
      return { status: "overdue", days: Math.abs(daysRemaining) };
    if (daysRemaining <= 3) return { status: "urgent", days: daysRemaining };
    return { status: "normal", days: daysRemaining };
  };

  if (!user) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } flex items-center justify-center`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-xl text-center ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-xl max-w-md`}
        >
          <div className="text-6xl mb-4 text-purple-500 mx-auto">
            <FaBook />
          </div>
          <h1
            className={`text-2xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            My Borrowed Books
          </h1>
          <p
            className={`mb-6 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Please log in to view your borrowed books
          </p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } flex items-center justify-center`}
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            },
            scale: {
              repeat: Infinity,
              duration: 1.5,
              repeatType: "reverse",
            },
          }}
          className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
        >
          <FaBook className="text-white text-3xl" />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } py-8 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            My Borrowed Books
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {borrowedBooks.length} book{borrowedBooks.length !== 1 ? "s" : ""}{" "}
            currently borrowed
          </p>
        </motion.div>

        <AnimatePresence>
          {borrowedBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`p-8 rounded-xl text-center ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="text-6xl mb-4 text-purple-500 mx-auto">
                <RiBookmarkFill />
              </div>
              <h2
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                No Books Borrowed
              </h2>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                You haven't borrowed any books yet. Browse our collection to
                find your next read!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {borrowedBooks.map((book) => {
                const dueStatus = getDueStatus(book.returnDate);

                return (
                  <motion.div
                    key={book._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`rounded-xl overflow-hidden shadow-lg ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <motion.div
                      className="cursor-pointer"
                      onClick={() =>
                        setExpandedBook(
                          expandedBook === book._id ? null : book._id
                        )
                      }
                    >
                      <div className="p-4 flex items-start gap-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex-shrink-0 relative"
                        >
                          <img
                            src={
                              book.bookDetails.image ||
                              "/default-book-cover.jpg"
                            }
                            alt={book.bookDetails.name}
                            className="w-16 h-20 object-cover rounded-lg shadow-md"
                          />
                          {dueStatus.status === "overdue" && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                              <FaExclamationTriangle className="text-xs" />
                            </div>
                          )}
                        </motion.div>

                        <div className="flex-1">
                          <h3
                            className={`font-bold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {book.bookDetails.name}
                          </h3>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            by {book.bookDetails.author}
                          </p>

                          <div className="mt-2 flex items-center gap-4">
                            <div>
                              <p
                                className={`text-xs ${
                                  theme === "dark"
                                    ? "text-gray-500"
                                    : "text-gray-500"
                                }`}
                              >
                                Borrowed
                              </p>
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-700"
                                }`}
                              >
                                {format(
                                  new Date(book.borrowedDate),
                                  "MMM d, yyyy"
                                )}
                              </p>
                            </div>

                            <FaArrowRight
                              className={`${
                                theme === "dark"
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}
                            />

                            <div>
                              <p
                                className={`text-xs ${
                                  theme === "dark"
                                    ? "text-gray-500"
                                    : "text-gray-500"
                                }`}
                              >
                                Due Date
                              </p>
                              <div className="flex items-center gap-1">
                                <p
                                  className={`text-sm ${
                                    dueStatus.status === "overdue"
                                      ? "text-red-500"
                                      : dueStatus.status === "urgent"
                                      ? "text-yellow-500"
                                      : theme === "dark"
                                      ? "text-green-400"
                                      : "text-green-600"
                                  }`}
                                >
                                  {format(
                                    new Date(book.returnDate),
                                    "MMM d, yyyy"
                                  )}
                                </p>
                                {dueStatus.status === "overdue" && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                                    {dueStatus.days} day
                                    {dueStatus.days !== 1 ? "s" : ""} overdue
                                  </span>
                                )}
                                {dueStatus.status === "urgent" && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                                    Due in {dueStatus.days} day
                                    {dueStatus.days !== 1 ? "s" : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {expandedBook === book._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`px-4 pb-4 ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Book ID: {book._id}
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleReturn(book._id)}
                                disabled={returningId === book._id}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                  returningId === book._id
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : dueStatus.status === "overdue"
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                              >
                                {returningId === book._id ? (
                                  <>
                                    <svg
                                      className="animate-spin h-4 w-4 text-white"
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
                                    Returning...
                                  </>
                                ) : (
                                  <>
                                    <FaCheck /> Return Book
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BorrowedPage;
