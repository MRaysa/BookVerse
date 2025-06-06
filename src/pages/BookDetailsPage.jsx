import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import BorrowModal from "../components/BorrowModal";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-hot-toast";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { user } = use(AuthContext);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/books/${id}`);
        setBook(response.data.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        navigate("/books");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleBorrow = async (returnDate) => {
    try {
      const token = await user.getIdToken();
      await axios.post(
        "/api/borrow",
        {
          bookId: book._id,
          returnDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBook((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
      setShowModal(false);
      toast.success("Book borrowed successfully!");
    } catch (error) {
      console.error("Error borrowing book:", error);
      toast.error(error.response?.data?.message || "Failed to borrow book");
    }
  };

  if (loading || !book) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <section
      className={`py-12 px-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center ${
              theme === "dark" ? "text-purple-400" : "text-purple-600"
            }`}
          >
            ← Back to books
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl overflow-hidden shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={book.image}
                alt={book.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <h2 className="text-2xl font-bold mb-2">{book.name}</h2>
              <p className="text-lg mb-4">by {book.author}</p>

              <div className="flex items-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  {book.category}
                </span>
                <span
                  className={`ml-4 ${
                    book.quantity > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {book.quantity > 0
                    ? `${book.quantity} available`
                    : "Out of stock"}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {book.description || "No description available."}
                </p>
              </div>

              {user && (
                <button
                  onClick={() => setShowModal(true)}
                  disabled={book.quantity <= 0}
                  className={`px-6 py-2 rounded-md ${
                    book.quantity <= 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : theme === "dark"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-purple-500 hover:bg-purple-600"
                  } text-white transition-colors`}
                >
                  Borrow Book
                </button>
              )}

              {!user && (
                <p className="text-gray-500">
                  Please login to borrow this book
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {showModal && (
          <BorrowModal
            book={book}
            user={user}
            onClose={() => setShowModal(false)}
            onBorrow={handleBorrow}
          />
        )}
      </div>
    </section>
  );
};

export default BookDetailsPage;
