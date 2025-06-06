import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../contexts/ThemeContext";

const BorrowModal = ({ book, user, onClose, onBorrow }) => {
  const [returnDate, setReturnDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!returnDate) return;

    setLoading(true);
    await onBorrow(returnDate);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`relative rounded-lg p-6 max-w-md w-full ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Borrow {book.name}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Your Name</label>
            <input
              type="text"
              value={user.displayName || ""}
              readOnly
              className={`w-full p-2 rounded border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Your Email</label>
            <input
              type="email"
              value={user.email || ""}
              readOnly
              className={`w-full p-2 rounded border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-100 border-gray-300"
              }`}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">Return Date</label>
            <DatePicker
              selected={returnDate}
              onChange={(date) => setReturnDate(date)}
              minDate={new Date()}
              className={`w-full p-2 rounded border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-100 border-gray-300"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !returnDate}
            className={`w-full py-2 px-4 rounded-md ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white transition-colors`}
          >
            {loading ? "Processing..." : "Confirm Borrow"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BorrowModal;
