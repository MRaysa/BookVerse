import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "../api/api";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const BorrowedPage = () => {
  const { user } = useContext(AuthContext);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await axios.get("/api/borrowed");
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

      // First verify the record exists locally
      const recordExists = borrowedBooks.some((book) => book._id === borrowId);
      if (!recordExists) {
        throw new Error("Borrow record not found in your list");
      }

      const response = await axios.post(`/api/return/${borrowId}`, null, {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      if (response.data.success) {
        // Refresh the borrowed books list
        const refreshResponse = await axios.get("/api/borrowed", {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });
        setBorrowedBooks(refreshResponse.data.data);
        toast.success("Book returned successfully!");
      } else {
        throw new Error(response.data.message || "Failed to return book");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);

      if (error.response?.status === 404) {
        // If record not found, refresh the list
        try {
          const refreshResponse = await axios.get("/api/borrowed", {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });
          setBorrowedBooks(refreshResponse.data.data);
        } catch (refreshError) {
          console.error("Failed to refresh borrowed books:", refreshError);
        }
      }
    } finally {
      setReturningId(null);
    }
  };

  if (!user) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } p-8`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className={`text-2xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Borrowed Books
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Please log in to view your borrowed books.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } p-8`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className={`text-2xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Your Borrowed Books
          </h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
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
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Your Borrowed Books
        </motion.h1>

        {borrowedBooks.length === 0 ? (
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
              You haven't borrowed any books yet.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {borrowedBooks.map((book) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg flex flex-col md:flex-row gap-4 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-md`}
              >
                <div className="w-full md:w-1/6">
                  <img
                    src={book.bookDetails.image || "/default-book-cover.jpg"}
                    alt={book.bookDetails.name}
                    className="w-full h-auto rounded-md"
                  />
                </div>

                <div className="flex-1">
                  <h2
                    className={`text-xl font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {book.bookDetails.name}
                  </h2>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    by {book.bookDetails.author}
                  </p>

                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Borrowed Date
                      </p>
                      <p
                        className={
                          theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }
                      >
                        {format(new Date(book.borrowedDate), "MMM dd, yyyy")}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Due Date
                      </p>
                      <p
                        className={
                          new Date(book.returnDate) < new Date()
                            ? "text-red-500"
                            : theme === "dark"
                            ? "text-gray-200"
                            : "text-gray-700"
                        }
                      >
                        {format(new Date(book.returnDate), "MMM dd, yyyy")}
                        {new Date(book.returnDate) < new Date() && (
                          <span
                            className={`ml-2 text-xs px-2 py-1 rounded-full ${
                              theme === "dark"
                                ? "bg-red-900 text-red-300"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            Overdue
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end md:justify-start">
                  <button
                    onClick={() => handleReturn(book._id)}
                    disabled={returningId === book._id}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      returningId === book._id
                        ? theme === "dark"
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-300 text-gray-600"
                        : theme === "dark"
                        ? "bg-green-700 hover:bg-green-600 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {returningId === book._id ? "Returning..." : "Return Book"}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BorrowedPage;
