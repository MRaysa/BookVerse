import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api/api";
import BorrowModal from "../components/BorrowModal";
import { toast } from "react-hot-toast";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiUser,
  FiTag,
  FiInfo,
  FiChevronRight,
  FiStar,
  FiThumbsUp,
} from "react-icons/fi";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Sample similar books data
  const similarBooks = [
    {
      id: 1,
      title: "Top Fiction Picks",
      author: "Various Authors",
      image: "https://prh.imgix.net/articles/top10-fiction-1600x800.jpg",
      rating: 4.5,
    },
    {
      id: 2,
      title: "Faber Fiction",
      author: "Faber Collection",
      image:
        "https://www.faber.co.uk/wp-content/uploads/2024/04/Faber-Fiction-credit-Yeshen-Venema-sq-640x460.jpg",
      rating: 4.2,
    },
    {
      id: 3,
      title: "Young Adult Series",
      author: "Faber YA",
      image:
        "https://www.faber.co.uk/wp-content/uploads/2024/04/Faber-Young-Adult-Books-credit-Yeshen-Venema-sq-640x460.jpg",
      rating: 4.7,
    },
  ];

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      user: "BookLover42",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      date: "2 days ago",
      comment:
        "This book completely changed my perspective! The character development was incredible and the plot twists kept me engaged until the very last page.",
      likes: 24,
    },
    {
      id: 2,
      user: "LiteraryExplorer",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4,
      date: "1 week ago",
      comment:
        "While I enjoyed the overall story, I felt the middle section dragged a bit. Still, the ending made it all worthwhile!",
      likes: 12,
    },
  ];

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const bookResponse = await api.get(`/api/books/${id}`);
        setBook(bookResponse.data.data);

        if (user) {
          try {
            const borrowResponse = await api.get(`/api/borrowed/${id}`, {
              headers: {
                Authorization: `Bearer ${await user.getIdToken()}`,
              },
            });
            setAlreadyBorrowed(borrowResponse.data.isBorrowed);
          } catch (borrowError) {
            console.log("Borrow check error:", borrowError);
            setAlreadyBorrowed(false);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch book details");
        toast.error(
          err.response?.data?.message || "Failed to fetch book details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id, user]);

  const handleBorrow = async (returnDate) => {
    try {
      if (book.quantity <= 0) {
        toast.error("No copies available");
        setShowBorrowModal(false);
        return;
      }

      const response = await api.post("/api/borrow", {
        bookId: id,
        returnDate: returnDate.toISOString(),
        userId: user.uid || user.email,
      });

      if (response.data.success) {
        setBook((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
        setAlreadyBorrowed(true);
        setShowBorrowModal(false);
        toast.success("Book borrowed successfully!", {
          icon: "📚",
          style: {
            borderRadius: "10px",
            background: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#333",
          },
        });
      } else {
        throw new Error(response.data.message || "Failed to borrow book");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(errorMessage, {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#333",
        },
      });

      try {
        const refreshResponse = await api.get(`/api/books/${id}`);
        setBook(refreshResponse.data.data);
      } catch (refreshError) {
        console.error("Refresh error:", refreshError);
      }
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          animate={{
            rotate: 360,
            transition: {
              repeat: Infinity,
              duration: 1,
              ease: "linear",
            },
          }}
          className={`w-12 h-12 rounded-full border-4 border-t-transparent ${
            theme === "dark" ? "border-purple-500" : "border-purple-600"
          }`}
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } p-8`}
      >
        <div className="max-w-md text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`p-6 rounded-2xl shadow-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-6xl mb-4">📕</div>
            <h2
              className={`text-2xl font-bold mb-4 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              Oops! Something went wrong
            </h2>
            <p
              className={`mb-6 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {error}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className={`px-6 py-3 rounded-full font-semibold ${
                theme === "dark"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-500 hover:bg-purple-600"
              } text-white transition-all`}
            >
              <FiArrowLeft className="inline mr-2" />
              Go Back
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (!book) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } p-8`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div
            className={`p-8 rounded-2xl shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2
              className={`text-2xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Book not found
            </h2>
            <p
              className={`mb-6 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              The book you're looking for doesn't exist or may have been
              removed.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className={`px-6 py-3 rounded-full font-semibold ${
                theme === "dark"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-500 hover:bg-purple-600"
              } text-white transition-all`}
            >
              <FiArrowLeft className="inline mr-2" />
              Browse More Books
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } p-4 md:p-8`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center px-4 py-2 rounded-full ${
            theme === "dark"
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-white hover:bg-gray-100"
          } shadow-md`}
        >
          <FiArrowLeft className="mr-2" />
          Back
        </motion.button>

        {/* Book Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl shadow-xl overflow-hidden ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:w-2/5 relative">
              <div className="relative h-full min-h-96 md:min-h-full">
                {!imageLoaded && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div className="animate-pulse h-full w-full"></div>
                  </div>
                )}
                <motion.img
                  src={book.image || "/default-book-cover.jpg"}
                  alt={book.name}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="p-6 md:p-8 md:w-3/5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h1
                      className={`text-3xl md:text-4xl font-bold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {book.name}
                    </h1>
                    <p
                      className={`text-xl mb-4 flex items-center ${
                        theme === "dark" ? "text-purple-300" : "text-purple-600"
                      }`}
                    >
                      <FiUser className="mr-2" />
                      {book.author}
                    </p>
                  </div>
                </div>

                {/* Rating and Availability Section */}
                <div
                  className={`flex items-center justify-between mb-6 p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`mr-2 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Rating:
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(book.rating)
                              ? "text-yellow-400"
                              : theme === "dark"
                              ? "text-gray-500"
                              : "text-gray-300"
                          }`}
                          fill={i < book.rating ? "currentColor" : "none"}
                        />
                      ))}
                      <span
                        className={`ml-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {book.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center ${
                      book.quantity > 0
                        ? theme === "dark"
                          ? "text-emerald-400"
                          : "text-emerald-600"
                        : theme === "dark"
                        ? "text-red-400"
                        : "text-red-600"
                    }`}
                  >
                    <span className="font-medium">
                      {book.quantity > 0
                        ? `${book.quantity} available`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>

                {/* Meta Information */}
                <div
                  className={`grid grid-cols-2 gap-4 mb-6 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center">
                    <FiTag className="mr-2" />
                    <span>{book.category}</span>
                  </div>
                  <div className="flex items-center">
                    <FiBookOpen className="mr-2" />
                    <span>{book.pages || "N/A"} pages</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    <span>{book.publishedYear || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <FiInfo className="mr-2" />
                    <span>{book.language || "English"}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Description
                  </h3>
                  <p
                    className={`leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {book.description || "No description available."}
                  </p>
                </div>

                {/* Borrow Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <motion.button
                    whileHover={
                      book.quantity > 0 && user && !alreadyBorrowed
                        ? { scale: 1.03 }
                        : {}
                    }
                    whileTap={
                      book.quantity > 0 && user && !alreadyBorrowed
                        ? { scale: 0.97 }
                        : {}
                    }
                    onClick={() => setShowBorrowModal(true)}
                    disabled={book.quantity <= 0 || !user || alreadyBorrowed}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                      book.quantity <= 0 || !user || alreadyBorrowed
                        ? theme === "dark"
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : theme === "dark"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    } shadow-lg`}
                  >
                    {!user
                      ? "Login to Borrow"
                      : alreadyBorrowed
                      ? "You already borrowed this book"
                      : book.quantity <= 0
                      ? "Out of Stock"
                      : "Borrow This Book"}
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Additional Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid md:grid-cols-2 gap-8"
        >
          {/* Similar Books Section */}
          <div
            className={`rounded-2xl p-6 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                You Might Also Like
              </h3>
              <button
                className={`flex items-center text-sm ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
              >
                View all <FiChevronRight className="ml-1" />
              </button>
            </div>

            <div className="relative">
              <div className="flex space-x-6 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                {similarBooks.map((similarBook) => (
                  <motion.div
                    key={similarBook.id}
                    whileHover={{ y: -8 }}
                    className="flex-shrink-0 w-48"
                  >
                    <div
                      className={`relative rounded-xl overflow-hidden shadow-md cursor-pointer ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                      onClick={() => navigate(`/books/${similarBook.id}`)}
                    >
                      <img
                        src={similarBook.image}
                        alt={similarBook.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <h4
                          className={`text-sm font-semibold mb-1 ${
                            theme === "dark" ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {similarBook.title}
                        </h4>
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {similarBook.author}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div
            className={`rounded-2xl p-6 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Reader Reviews
              </h3>
              <button
                className={`flex items-center text-sm ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
              >
                See all <FiChevronRight className="ml-1" />
              </button>
            </div>

            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * review.id }}
                  className={`p-4 rounded-xl ${
                    theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-start">
                    <img
                      src={review.avatar}
                      alt={review.user}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4
                            className={`font-medium ${
                              theme === "dark"
                                ? "text-gray-200"
                                : "text-gray-700"
                            }`}
                          >
                            {review.user}
                          </h4>
                          <p
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {review.date}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`text-sm ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : theme === "dark"
                                  ? "text-gray-600"
                                  : "text-gray-300"
                              }`}
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p
                        className={`mt-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {review.comment}
                      </p>
                      <div className="flex items-center mt-3">
                        <button
                          className={`flex items-center text-xs ${
                            theme === "dark"
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <FiThumbsUp className="mr-1" />
                          Helpful ({review.likes})
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add Review Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg border-2 border-dashed ${
                  theme === "dark"
                    ? "border-gray-600 hover:border-purple-500 text-gray-300"
                    : "border-gray-300 hover:border-purple-400 text-gray-600"
                } transition-colors`}
              >
                + Add your review
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
          theme === "dark"
            ? "bg-purple-600 text-white"
            : "bg-white text-purple-600"
        }`}
      >
        <FiArrowLeft className="transform rotate-90" />
      </motion.button>

      {/* Borrow Modal */}
      <AnimatePresence>
        {showBorrowModal && user && (
          <BorrowModal
            book={book}
            user={user}
            onClose={() => setShowBorrowModal(false)}
            onBorrow={handleBorrow}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookDetails;
