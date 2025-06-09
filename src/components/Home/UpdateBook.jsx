import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useTheme } from "../../contexts/ThemeContext";
import api from "../../api/api";
import { FaSpinner, FaArrowLeft, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const categories = [
    "Fiction",
    "Science",
    "History",
    "Health",
    "Novel",
    "Thriller",
    "Drama",
    "Sci-Fi",
    "Biography",
    "Fantasy",
    "Psychology",
    "Travel",
  ];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/books/${id}`);
        setBook(response.data.data);

        // Set form values
        setValue("title", response.data.data.name);
        setValue("author", response.data.data.author);
        setValue("category", response.data.data.category);
        setValue("rating", response.data.data.rating);
        setValue("quantity", response.data.data.quantity);
        setValue("description", response.data.data.description || "");
        setValue("imageUrl", response.data.data.image);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch book details");
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Get auth token from wherever you store it (localStorage, cookies, etc.)
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/api/books/${id}`,
        {
          name: data.title,
          author: data.author,
          category: data.category,
          rating: data.rating,
          quantity: data.quantity,
          description: data.description,
          image: data.imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate(`/book-details/${id}`, {
          state: { message: "Book updated successfully!" },
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      setSubmitError(
        err.response?.data?.message ||
          "Failed to update book. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <FaSpinner className="animate-spin text-4xl text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        } p-4`}
      >
        <div className="max-w-md text-center">
          <h2
            className={`text-2xl font-bold mb-4 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            Error Loading Book
          </h2>
          <p
            className={`mb-6 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            className={`px-4 py-2 rounded-md ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
          >
            <FaArrowLeft className="inline mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center mb-6 ${
            theme === "dark" ? "text-purple-400" : "text-purple-600"
          }`}
        >
          <FaArrowLeft className="mr-2" />
          Back to Book
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-lg shadow-lg overflow-hidden ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } p-6`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Update Book
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Book Title */}
              <div>
                <label
                  className={`block mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Book Title*
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:border-purple-500"
                      : "bg-white border-gray-300 focus:border-purple-400"
                  } focus:outline-none focus:ring-1 ${
                    theme === "dark"
                      ? "focus:ring-purple-500"
                      : "focus:ring-purple-400"
                  }`}
                  {...register("title", {
                    required: "Book title is required",
                  })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Author Field */}
              <div>
                <label
                  className={`block mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Author Name*
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:border-purple-500"
                      : "bg-white border-gray-300 focus:border-purple-400"
                  } focus:outline-none focus:ring-1 ${
                    theme === "dark"
                      ? "focus:ring-purple-500"
                      : "focus:ring-purple-400"
                  }`}
                  {...register("author", {
                    required: "Author name is required",
                  })}
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.author.message}
                  </p>
                )}
              </div>

              {/* Category Field */}
              <div>
                <label
                  className={`block mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Category*
                </label>
                <select
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:border-purple-500"
                      : "bg-white border-gray-300 focus:border-purple-400"
                  } focus:outline-none focus:ring-1 ${
                    theme === "dark"
                      ? "focus:ring-purple-500"
                      : "focus:ring-purple-400"
                  }`}
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Rating Field */}
              <div>
                <label
                  className={`block mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:border-purple-500"
                      : "bg-white border-gray-300 focus:border-purple-400"
                  } focus:outline-none focus:ring-1 ${
                    theme === "dark"
                      ? "focus:ring-purple-500"
                      : "focus:ring-purple-400"
                  }`}
                  {...register("rating", {
                    required: "Rating is required",
                    min: { value: 1, message: "Minimum rating is 1" },
                    max: { value: 5, message: "Maximum rating is 5" },
                  })}
                />
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              {/* Quantity Field */}
              <div>
                <label
                  className={`block mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Available Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:border-purple-500"
                      : "bg-white border-gray-300 focus:border-purple-400"
                  } focus:outline-none focus:ring-1 ${
                    theme === "dark"
                      ? "focus:ring-purple-500"
                      : "focus:ring-purple-400"
                  }`}
                  {...register("quantity", {
                    required: "Quantity is required",
                    min: {
                      value: 0,
                      message: "Quantity cannot be negative",
                    },
                  })}
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Image URL Field */}
              <div>
                <label
                  className={`block mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Image URL
                </label>
                <input
                  type="url"
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:border-purple-500"
                      : "bg-white border-gray-300 focus:border-purple-400"
                  } focus:outline-none focus:ring-1 ${
                    theme === "dark"
                      ? "focus:ring-purple-500"
                      : "focus:ring-purple-400"
                  }`}
                  {...register("imageUrl")}
                />
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label
                className={`block mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Description
              </label>
              <textarea
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-purple-500"
                    : "bg-white border-gray-300 focus:border-purple-400"
                } focus:outline-none focus:ring-1 ${
                  theme === "dark"
                    ? "focus:ring-purple-500"
                    : "focus:ring-purple-400"
                }`}
                rows="4"
                {...register("description")}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              {submitError && (
                <p className="mb-4 text-sm text-red-500">{submitError}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto px-6 py-3 rounded-md flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white transition-colors disabled:opacity-70`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Update Book
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateBook;
