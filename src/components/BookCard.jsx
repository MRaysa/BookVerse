import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import { FiEdit2, FiEye, FiHeart, FiShare2, FiBookmark } from "react-icons/fi";
import {
  FaHeart,
  FaBookmark,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";

const BookCard = ({ book, onUpdate, onViewDetails }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  const shareOptionsVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 },
    },
  };

  const shareOptionItem = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <motion.span
          key={`full-${i}`}
          whileHover={{ scale: 1.2 }}
          className="inline-block"
        >
          <FaStar
            className={`${
              theme === "dark" ? "text-yellow-400" : "text-yellow-500"
            } drop-shadow-sm`}
          />
        </motion.span>
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <motion.span
          key="half"
          whileHover={{ scale: 1.2 }}
          className="inline-block"
        >
          <FaStarHalfAlt
            className={`${
              theme === "dark" ? "text-yellow-400" : "text-yellow-500"
            } drop-shadow-sm`}
          />
        </motion.span>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <motion.span
          key={`empty-${i}`}
          whileHover={{ scale: 1.2 }}
          className="inline-block"
        >
          <FaRegStar
            className={`${
              theme === "dark" ? "text-gray-500" : "text-gray-300"
            } drop-shadow-sm`}
          />
        </motion.span>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <motion.span
          whileHover={{ scale: 1.1 }}
          className={`text-sm font-semibold ${
            theme === "dark" ? "text-yellow-300" : "text-yellow-600"
          }`}
        >
          {rating.toFixed(1)}
        </motion.span>
      </div>
    );
  };

  const handleShare = (platform) => {
    // Implement share functionality
    console.log(`Sharing to ${platform}`);
    setShowShareOptions(false);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } hover:shadow-xl`}
    >
      {/* Quick action buttons that appear on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-3 right-3 z-10 flex space-x-2"
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`p-2 rounded-full backdrop-blur-sm ${
              theme === "dark"
                ? "bg-black bg-opacity-40 text-gray-200 hover:text-red-400"
                : "bg-white bg-opacity-80 text-gray-700 hover:text-red-500"
            }`}
            aria-label={isLiked ? "Unlike book" : "Like book"}
          >
            {isLiked ? (
              <FaHeart className="text-red-500 animate-pulse" />
            ) : (
              <FiHeart />
            )}
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className={`p-2 rounded-full backdrop-blur-sm ${
              theme === "dark"
                ? "bg-black bg-opacity-40 text-gray-200 hover:text-yellow-400"
                : "bg-white bg-opacity-80 text-gray-700 hover:text-yellow-500"
            }`}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {isBookmarked ? (
              <FaBookmark className="text-yellow-400 animate-bounce" />
            ) : (
              <FiBookmark />
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Book cover with overlay effects */}
      <div className="relative h-52 overflow-hidden group">
        <motion.img
          src={book.image || "/default-book-cover.jpg"}
          alt={book.name}
          className="w-full h-full object-cover transition-transform duration-500"
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.src = "/default-book-cover.jpg";
          }}
        />

        {/* Stock status overlay */}
        {book.quantity <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-white font-bold bg-red-600 px-3 py-1 rounded-full text-sm shadow-lg"
            >
              Out of Stock
            </motion.span>
          </div>
        )}

        {/* Quick view button that slides up on hover */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: isHovered ? 0 : 50,
            opacity: isHovered ? 1 : 0,
          }}
          className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(book._id);
            }}
            className={`w-full py-2 rounded-md flex items-center justify-center space-x-2 ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white text-sm font-medium transition-colors`}
          >
            <FiEye size={16} />
            <span>Quick View</span>
          </button>
        </motion.div>
      </div>

      {/* Book details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <motion.h3
            whileHover={{ color: theme === "dark" ? "#a78bfa" : "#8b5cf6" }}
            className={`text-lg font-bold line-clamp-2 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {book.name}
          </motion.h3>

          {onUpdate && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(book._id);
              }}
              className={`p-2 rounded-full ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Edit book"
            >
              <FiEdit2 size={18} />
            </motion.button>
          )}
        </div>

        <motion.p
          whileHover={{ color: theme === "dark" ? "#a78bfa" : "#8b5cf6" }}
          className={`text-sm mb-3 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          by {book.author}
        </motion.p>

        <div className="flex items-center justify-between mb-3">
          <StarRating rating={book.rating} />
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`text-sm font-medium ${
              book.quantity > 0
                ? theme === "dark"
                  ? "text-green-400"
                  : "text-green-600"
                : "text-red-500"
            }`}
          >
            {book.quantity > 0 ? `${book.quantity} available` : "Out of stock"}
          </motion.span>
        </div>

        <div className="flex items-center justify-between">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
              theme === "dark"
                ? "bg-gray-700 text-purple-300"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {book.category}
          </motion.span>

          <div className="flex space-x-2">
            {/* Share button with dropdown */}
            <div className="relative">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareOptions(!showShareOptions);
                }}
                className={`p-2 rounded-full ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-label="Share"
              >
                <FiShare2 size={16} />
              </motion.button>

              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    variants={shareOptionsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={`absolute right-0 bottom-full mb-2 w-40 p-2 rounded-lg shadow-lg z-20 ${
                      theme === "dark" ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    <motion.button
                      variants={shareOptionItem}
                      onClick={() => handleShare("facebook")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                        theme === "dark"
                          ? "hover:bg-gray-600 text-gray-200"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      <span className="mr-2">📘</span> Facebook
                    </motion.button>
                    <motion.button
                      variants={shareOptionItem}
                      onClick={() => handleShare("twitter")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                        theme === "dark"
                          ? "hover:bg-gray-600 text-gray-200"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      <span className="mr-2">🐦</span> Twitter
                    </motion.button>
                    <motion.button
                      variants={shareOptionItem}
                      onClick={() => handleShare("copy")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                        theme === "dark"
                          ? "hover:bg-gray-600 text-gray-200"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      <span className="mr-2">🔗</span> Copy Link
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(book._id);
              }}
              className={`flex items-center px-3 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white text-sm transition-colors`}
            >
              <FiEye className="mr-1" size={16} />
              Details
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
