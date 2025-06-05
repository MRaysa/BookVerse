import React from "react";
import { Link } from "react-router";
import Rating from "./Rating";

const BookTable = ({ books, onUpdate }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Cover</th>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Author</th>
            <th className="py-3 px-4 text-left">Category</th>
            <th className="py-3 px-4 text-left">Rating</th>
            <th className="py-3 px-4 text-left">Quantity</th>
            {onUpdate && <th className="py-3 px-4 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              key={book._id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <Link to={`/books/${book._id}`}>
                  <img
                    src={book.image || "/default-book-cover.jpg"}
                    alt={book.name}
                    className="w-12 h-16 object-cover rounded"
                  />
                </Link>
              </td>
              <td className="py-3 px-4">
                <Link
                  to={`/books/${book._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {book.name}
                </Link>
              </td>
              <td className="py-3 px-4">{book.author}</td>
              <td className="py-3 px-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {book.category}
                </span>
              </td>
              <td className="py-3 px-4">
                <Rating value={book.rating} />
              </td>
              <td className="py-3 px-4">
                <span
                  className={`font-medium ${
                    book.quantity > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {book.quantity}
                </span>
              </td>
              {onUpdate && (
                <td className="py-3 px-4">
                  <button
                    onClick={() => onUpdate(book._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Update
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
