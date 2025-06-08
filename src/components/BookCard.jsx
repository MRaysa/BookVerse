import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import ReactStars from "react-rating-stars-component";
import { useTheme } from "../contexts/ThemeContext";
import { FiEdit2, FiEye } from "react-icons/fi";

const BookCard = ({ book, onUpdate, onViewDetails }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl overflow-hidden shadow-lg transition-all ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } hover:shadow-xl`}
    >
      <div className="relative h-48 overflow-hidden group">
        <img
          src={book.image || "/default-book-cover.jpg"}
          alt={book.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {book.quantity <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold bg-red-600 px-3 py-1 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3
            className={`text-lg font-bold truncate ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {book.name}
          </h3>
          {onUpdate && (
            <button
              onClick={() => onUpdate(book._id)}
              className={`p-2 rounded-full ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Edit book"
            >
              <FiEdit2 size={18} />
            </button>
          )}
        </div>

        <p
          className={`text-sm mb-3 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          by {book.author}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <ReactStars
              count={5}
              value={book.rating}
              size={20}
              activeColor={theme === "dark" ? "#a78bfa" : "#8b5cf6"}
              edit={false}
            />
            <span
              className={`ml-2 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              ({book.rating.toFixed(1)})
            </span>
          </div>
          <span
            className={`text-sm font-medium ${
              book.quantity > 0
                ? theme === "dark"
                  ? "text-green-400"
                  : "text-green-600"
                : "text-red-500"
            }`}
          >
            {book.quantity > 0 ? `${book.quantity} available` : "Out of stock"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
              theme === "dark"
                ? "bg-gray-700 text-purple-300"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {book.category}
          </span>

          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails(book._id)}
              className={`flex items-center px-3 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white text-sm`}
            >
              <FiEye className="mr-1" size={16} />
              Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
