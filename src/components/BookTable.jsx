import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import Rating from "./Rating";
import {
  FaBook,
  FaUserEdit,
  FaTags,
  FaStar,
  FaBoxOpen,
  FaEdit,
  FaEye,
} from "react-icons/fa";

const BookTable = ({ books, onUpdate, onViewDetails }) => {
  const { theme } = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.01,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 },
    },
  };

  const iconVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
  };

  // Theme-based styles
  const themeStyles = {
    light: {
      tableHeader: "bg-gray-100 text-gray-800",
      tableRow: "hover:bg-gray-50",
      category: "bg-blue-100 text-blue-800",
      link: "text-blue-600 hover:text-blue-800",
      button: "text-blue-600 hover:text-blue-800",
      icon: "text-gray-700",
    },
    dark: {
      tableHeader: "bg-gray-800 text-gray-100",
      tableRow: "hover:bg-gray-700",
      category: "bg-blue-900 text-blue-100",
      link: "text-blue-400 hover:text-blue-300",
      button: "text-blue-400 hover:text-blue-300",
      icon: "text-gray-300",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <motion.div
      className="overflow-x-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <table
        className={`min-w-full rounded-lg overflow-hidden ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <thead className={currentTheme.tableHeader}>
          <tr>
            <th className="py-3 px-4 text-left">
              <div className="flex items-center">
                <FaBook className="mr-2" />
                Cover
              </div>
            </th>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">
              <div className="flex items-center">
                <FaUserEdit className="mr-2" />
                Author
              </div>
            </th>
            <th className="py-3 px-4 text-left">
              <div className="flex items-center">
                <FaTags className="mr-2" />
                Category
              </div>
            </th>
            <th className="py-3 px-4 text-left">
              <div className="flex items-center">
                <FaStar className="mr-2" />
                Rating
              </div>
            </th>
            <th className="py-3 px-4 text-left">
              <div className="flex items-center">
                <FaBoxOpen className="mr-2" />
                Quantity
              </div>
            </th>
            {(onUpdate || onViewDetails) && (
              <th className="py-3 px-4 text-left">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <motion.tr
              key={book._id}
              className={`border-b ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              } ${currentTheme.tableRow}`}
              variants={rowVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <td className="py-3 px-4">
                <Link to={`/books/${book._id}`}>
                  <motion.img
                    src={book.image || "/default-book-cover.jpg"}
                    alt={book.name}
                    className="w-12 h-16 object-cover rounded shadow-md"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  />
                </Link>
              </td>
              <td className="py-3 px-4">
                <Link
                  to={`/books/${book._id}`}
                  className={`${currentTheme.link} hover:underline font-medium flex items-center`}
                >
                  {book.name}
                </Link>
              </td>
              <td className="py-3 px-4 text-blue-500">{book.author}</td>
              <td className="py-3 px-4">
                <span
                  className={`${currentTheme.category} px-3 py-1 rounded-full text-xs flex items-center w-min`}
                >
                  {book.category}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <Rating value={book.rating} theme={theme} />
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <span
                    className={`font-medium ${
                      book.quantity > 0
                        ? theme === "dark"
                          ? "text-green-400"
                          : "text-green-600"
                        : theme === "dark"
                        ? "text-red-400"
                        : "text-red-600"
                    }`}
                  >
                    {book.quantity}
                  </span>
                </div>
              </td>
              {(onUpdate || onViewDetails) && (
                <td className="py-3 px-4">
                  <div className="flex space-x-3">
                    {onViewDetails && (
                      <motion.button
                        onClick={() => onViewDetails(book._id)}
                        className={`${currentTheme.button} text-sm font-medium flex items-center cursor-pointer`}
                        variants={iconVariants}
                        whileHover="hover"
                        whileTap="tap"
                        title="View Details"
                      >
                        <FaEye className="mr-1" />
                        <span className="hidden md:inline">View</span>
                      </motion.button>
                    )}
                    {onUpdate && (
                      <motion.button
                        onClick={() => onUpdate(book._id)}
                        className={`${currentTheme.button} text-sm font-medium flex items-center cursor-pointer`}
                        variants={iconVariants}
                        whileHover="hover"
                        whileTap="tap"
                        title="Edit"
                      >
                        <FaEdit className="mr-1" />
                        <span className="hidden md:inline">Edit</span>
                      </motion.button>
                    )}
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>

      {books.length === 0 && (
        <motion.div
          className={`text-center py-10 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          } flex flex-col items-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FaBook className="text-4xl mb-3" />
          <p>No books found. Try adjusting your search criteria.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookTable;
