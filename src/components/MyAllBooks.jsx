import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import Rating from "./Rating";
import { FaBook, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";

const MyAllBooks = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMyBooks = async () => {
      try {
        const token = await user.getIdToken();
        const response = await axios.get(
          "https://book-verse-server-sigma.vercel.app/api/my-books",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to load books");
        }

        const booksData = response.data.data || [];
        if (!Array.isArray(booksData)) {
          throw new Error("Invalid data format received from server");
        }

        setBooks(booksData);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load books"
        );

        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [user, navigate]);

  const handleDelete = async (bookId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: theme === "dark" ? "#1f2937" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#1f2937",
    });

    if (!result.isConfirmed) return;

    try {
      const token = await user.getIdToken();
      await axios.delete(
        `https://book-verse-server-sigma.vercel.app/api/books/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      Swal.fire({
        title: "Deleted!",
        text: "Your book has been deleted.",
        icon: "success",
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
      });
    } catch (err) {
      console.error("Error deleting book:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to delete book",
        icon: "error",
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
      });

      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            },
            scale: {
              repeat: Infinity,
              duration: 1.5,
              repeatType: "reverse",
            },
          }}
          className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"
        >
          <FaBook className="text-white text-3xl" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`container mx-auto px-4 py-8 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-6 rounded-xl shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className={`text-xl font-bold mb-2 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            Error
          </div>
          <p
            className={`mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } pb-12`}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-purple-900"
                }`}
              >
                My Books Collection
              </h1>
              <p
                className={`mt-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {books.length} book{books.length !== 1 ? "s" : ""} in your
                library
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`relative flex items-center ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                } rounded-lg shadow-sm w-full`}
              >
                <FaSearch
                  className={`absolute left-3 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 text-white focus:ring-purple-500"
                      : "bg-white text-gray-900 focus:ring-purple-300"
                  }`}
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/add-book")}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white shadow-md`}
              >
                <FaPlus /> Add Book
              </motion.button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`text-center py-12 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="text-6xl mb-4 text-purple-500 mx-auto flex justify-center">
                <IoBookOutline />
              </div>
              <h2
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {searchTerm ? "No matching books found" : "No Books Found"}
              </h2>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {searchTerm
                  ? "Try a different search term"
                  : "You haven't added any books yet."}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/add-book")}
                className={`px-6 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white`}
              >
                Add Your First Book
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl shadow-lg overflow-hidden ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead
                    className={`${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Cover
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Title
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Author
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Category
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Rating
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Stock
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y divide-gray-200 ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    {filteredBooks.map((book, index) => (
                      <motion.tr
                        key={book._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        className={`${
                          theme === "dark"
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/book-details/${book._id}`}>
                            <motion.img
                              src={book.image || "/default-book-cover.jpg"}
                              alt={book.name}
                              className="w-12 h-16 object-cover rounded shadow"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 400 }}
                              onError={(e) => {
                                e.target.src = "/default-book-cover.jpg";
                              }}
                            />
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/book-details/${book._id}`}
                            className={`font-medium ${
                              theme === "dark"
                                ? "text-purple-400 hover:text-purple-300"
                                : "text-purple-600 hover:text-purple-800"
                            }`}
                          >
                            {book.name}
                          </Link>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {book.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              theme === "dark"
                                ? "bg-purple-900/50 text-purple-200"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {book.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Rating value={book.rating} theme={theme} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              book.quantity > 0
                                ? theme === "dark"
                                  ? "bg-green-900/50 text-green-300"
                                  : "bg-green-100 text-green-800"
                                : theme === "dark"
                                ? "bg-red-900/50 text-red-300"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {book.quantity}{" "}
                            {book.quantity === 1 ? "copy" : "copies"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                navigate(`/update-book/${book._id}`)
                              }
                              className={`${
                                theme === "dark"
                                  ? "text-blue-400 hover:text-blue-300"
                                  : "text-blue-600 hover:text-blue-800"
                              }`}
                              title="Edit"
                            >
                              <FaEdit />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(book._id)}
                              className={`${
                                theme === "dark"
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-red-600 hover:text-red-800"
                              }`}
                              title="Delete"
                            >
                              <FaTrash />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyAllBooks;
