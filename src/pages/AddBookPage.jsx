import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

const AddBookPage = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const categories = [
    "Novel",
    "Thriller",
    "History",
    "Drama",
    "Sci-Fi",
    "Biography",
    "Fantasy",
    "Fiction",
    "Science",
    "Health",
    "Psychology",
    "Travel",
  ];

  const bookContentInfo = `
  This book contains:
  - Complete text of the work
  - Author biography
  - Critical analysis
  - Discussion questions
  - Further reading suggestions
  `;

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please login to add books");
      return;
    }

    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        "https://book-verse-server-sigma.vercel.app/api/books",
        {
          name: data.title,
          author: data.author,
          category: data.category,
          quantity: parseInt(data.quantity),
          rating: parseFloat(data.rating),
          description: data.description,
          image: data.imageUrl,
          content: bookContentInfo,
          addedBy: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Book added successfully!");
      reset();
      navigate("/all-books");
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error(error.response?.data?.message || "Failed to add book");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: `0px 5px 15px ${
        theme === "dark" ? "rgba(59, 130, 246, 0.4)" : "rgba(0, 0, 0, 0.1)"
      }`,
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen py-6 ${
        theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-blue-50 text-gray-800"
      }`}
    >
      <div
        className={`max-w-4xl mx-auto p-6 rounded-lg shadow-lg ${
          theme === "dark"
            ? "bg-gray-700 text-gray-100"
            : "bg-blue-50 text-gray-800"
        }`}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-bold text-center mb-8 ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}
        >
          Add New Book
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {/* Book Title */}
            <motion.div variants={itemVariants}>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Book Title *
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter book title"
              />
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.title.message}
                </motion.p>
              )}
            </motion.div>

            {/* Author */}
            <motion.div variants={itemVariants}>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Author *
              </label>
              <input
                type="text"
                {...register("author", { required: "Author is required" })}
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter author name"
              />
              {errors.author && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.author.message}
                </motion.p>
              )}
            </motion.div>

            {/* Category */}
            <motion.div variants={itemVariants}>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.category.message}
                </motion.p>
              )}
            </motion.div>

            {/* Quantity */}
            <motion.div variants={itemVariants}>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Quantity *
              </label>
              <input
                type="number"
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 1, message: "Minimum quantity is 1" },
                })}
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter quantity"
                min="1"
              />
              {errors.quantity && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.quantity.message}
                </motion.p>
              )}
            </motion.div>

            {/* Rating */}
            <motion.div variants={itemVariants}>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Rating (1-5)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  {...register("rating", {
                    min: { value: 1, message: "Minimum rating is 1" },
                    max: { value: 5, message: "Maximum rating is 5" },
                  })}
                  className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter rating (1-5)"
                  min="1"
                  max="5"
                  step="0.1"
                />
                {watch("rating") && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-1 rounded-full ${
                      theme === "dark" ? "bg-blue-900" : "bg-blue-100"
                    } text-blue-600`}
                  >
                    {watch("rating")}
                  </motion.div>
                )}
              </div>
              {errors.rating && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.rating.message}
                </motion.p>
              )}
            </motion.div>

            {/* Image URL */}
            <motion.div variants={itemVariants}>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Image URL
              </label>
              <input
                type="url"
                {...register("imageUrl")}
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Enter image URL"
              />
              {watch("imageUrl") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <p className="text-xs mb-1">Image Preview:</p>
                  <img
                    src={watch("imageUrl")}
                    alt="Book cover preview"
                    className="h-20 w-auto rounded shadow"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Added By (read-only) */}
            <motion.div variants={itemVariants}>
              <label
                className={`block text-sm font-medium mb-1 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Added By
              </label>
              <input
                type="text"
                value={user?.email || ""}
                readOnly
                className={`w-full px-4 py-2 rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "border-gray-300 bg-gray-100"
                } cursor-not-allowed`}
              />
            </motion.div>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <label
              className={`block text-sm font-medium mb-1 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              {...register("description")}
              rows="4"
              className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter book description"
            ></textarea>
          </motion.div>

          {/* Book Content Information (static) */}
          <motion.div
            variants={itemVariants}
            className={`p-4 rounded-md ${
              theme === "dark" ? "bg-blue-900 bg-opacity-30" : "bg-blue-50"
            }`}
          >
            <h3
              className={`font-medium mb-2 ${
                theme === "dark" ? "text-blue-300" : "text-blue-800"
              }`}
            >
              Book Content Information
            </h3>
            <pre
              className={`text-sm whitespace-pre-wrap ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {bookContentInfo}
            </pre>
            <p
              className={`text-sm mt-2 ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              This information will be included with all books.
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.div className="flex justify-end" variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isLoading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className={`px-6 py-3 rounded-md focus:outline-none focus:ring-2 cursor-pointer focus:ring-offset-2 ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-800"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-white"
              } text-white font-medium ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  ⏳
                </motion.span>
              ) : (
                "Add Book in Library"
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default AddBookPage;
