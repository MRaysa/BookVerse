import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import ReactStars from "react-rating-stars-component";
import { useTheme } from "../contexts/ThemeContext";

const BookCard = ({ book }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg overflow-hidden shadow-lg ${
        theme === "dark" ? "bg-gray-700" : "bg-white"
      }`}
    >
      <div className="h-48 overflow-hidden">
        <img
          src={book.image}
          alt={book.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{book.name}</h3>
        <p className="text-sm text-gray-500 mb-2">by {book.author}</p>
        <span
          className={`inline-block px-2 py-1 text-xs rounded-full ${
            theme === "dark" ? "bg-gray-600" : "bg-gray-200"
          } mb-3`}
        >
          {book.category}
        </span>
        <div className="flex items-center justify-between mb-3">
          <ReactStars
            count={5}
            value={book.rating}
            size={20}
            activeColor="#ffd700"
            edit={false}
          />
          <span
            className={`text-sm ${
              book.quantity > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {book.quantity > 0 ? `${book.quantity} available` : "Out of stock"}
          </span>
        </div>
        <Link
          to={`/books/${book._id}`}
          className={`block text-center py-2 px-4 rounded-md ${
            theme === "dark"
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-500 hover:bg-purple-600"
          } text-white transition-colors`}
        >
          Details
        </Link>
      </div>
    </motion.div>
  );
};

export default BookCard;
