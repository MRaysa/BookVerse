import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../contexts/ThemeContext";
import { FiX, FiUser, FiMail, FiCalendar, FiBook } from "react-icons/fi";

const BorrowModal = ({ book, user, onClose, onBorrow }) => {
  const [returnDate, setReturnDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!returnDate) return;

    setLoading(true);
    try {
      await onBorrow(returnDate);
    } catch (err) {
      console.error("Borrow error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-full ${
              theme === "dark"
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <FiX size={20} />
          </motion.button>

          <div className="flex items-start mb-6">
            <div
              className={`p-3 rounded-lg mr-4 ${
                theme === "dark" ? "bg-purple-900/30" : "bg-purple-100"
              }`}
            >
              <FiBook
                size={24}
                className={
                  theme === "dark" ? "text-purple-300" : "text-purple-600"
                }
              />
            </div>
            <div>
              <h2
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Borrow This Book
              </h2>
              <p
                className={`mt-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {book.name}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                className={`flex items-center mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FiUser className="mr-2" />
                Your Name
              </label>
              <div
                className={`flex items-center p-3 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700/50 border border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <span
                  className={
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }
                >
                  {user?.displayName || "Not available"}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label
                className={`flex items-center mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FiMail className="mr-2" />
                Your Email
              </label>
              <div
                className={`flex items-center p-3 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700/50 border border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <span
                  className={
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }
                >
                  {user?.email || "Not available"}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label
                className={`flex items-center mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FiCalendar className="mr-2" />
                Return Date
              </label>
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                minDate={new Date()}
                className={`w-full p-3 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700/50 border border-gray-600 text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-800"
                }`}
                calendarClassName={
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }
                dayClassName={() =>
                  theme === "dark"
                    ? "text-white hover:bg-gray-700"
                    : "text-gray-800 hover:bg-gray-100"
                }
                required
                popperPlacement="bottom-start"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading || !returnDate}
              whileHover={!loading && returnDate ? { scale: 1.02 } : {}}
              whileTap={!loading && returnDate ? { scale: 0.98 } : {}}
              className={`w-full py-3 px-4 rounded-xl font-medium text-lg transition-all ${
                loading || !returnDate
                  ? theme === "dark"
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              } shadow-lg`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Processing...
                </span>
              ) : (
                "Confirm Borrow"
              )}
            </motion.button>
          </form>

          <div
            className={`mt-4 text-center text-sm ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Please return the book by the selected date to avoid late fees.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BorrowModal;
