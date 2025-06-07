import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import ReactStars from "react-rating-stars-component";
import { useTheme } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api/api";
import BorrowModal from "../components/BorrowModal";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/books/${id}`);
        setBook(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleBorrow = async (returnDate) => {
    try {
      await api.post("/api/borrow", {
        bookId: id,
        returnDate: returnDate.toISOString(),
      });

      // Update local book quantity
      setBook((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
      setShowBorrowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to borrow book");
    }
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
            onClick={() => navigate(-1)}
            className={`mt-4 px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        } p-8`}
      >
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Book not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className={`mt-4 px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
          >
            Go Back
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl shadow-lg overflow-hidden ${
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
            <div className="p-8 md:w-2/3">
              <motion.h1
                className={`text-3xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {book.name}
              </motion.h1>

              <p
                className={`text-xl mb-4 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                by {book.author}
              </p>

              <div className="flex items-center mb-4">
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
                <span className="font-semibold">Category:</span> {book.category}
              </p>

              <p
                className={`mb-4 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <span className="font-semibold">Available:</span>{" "}
                {book.quantity}
              </p>

              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {book.description}
              </p>

              <button
                onClick={() => setShowBorrowModal(true)}
                disabled={book.quantity <= 0 || !user}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  book.quantity <= 0 || !user
                    ? "bg-gray-400 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white transition-colors`}
              >
                {!user
                  ? "Login to Borrow"
                  : book.quantity <= 0
                  ? "Out of Stock"
                  : "Borrow This Book"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {showBorrowModal && (
        <BorrowModal
          book={book}
          user={user}
          onClose={() => setShowBorrowModal(false)}
          onBorrow={handleBorrow}
        />
      )}
    </div>
  );
};

export default BookDetails;
