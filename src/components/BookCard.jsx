import React from "react";
import { Link } from "react-router";
import Rating from "./Rating";

const BookCard = ({ book, onUpdate }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/books/${book._id}`}>
        <img
          src={book.image || "/default-book-cover.jpg"}
          alt={book.name}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-4">
        <Link to={`/books/${book._id}`}>
          <h3 className="text-lg font-semibold mb-1 hover:text-blue-600 transition-colors">
            {book.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-2">by {book.author}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {book.category}
          </span>
          <Rating value={book.rating} />
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-sm font-medium ${
              book.quantity > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {book.quantity > 0 ? `${book.quantity} available` : "Out of stock"}
          </span>

          {onUpdate && (
            <button
              onClick={() => onUpdate(book._id)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
