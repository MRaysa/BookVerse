import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaBook, FaHome, FaSearch, FaBookOpen } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

const ErrorPage = () => {
  const { theme } = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  const floatVariants = {
    float: {
      y: [-15, 15],
      transition: {
        y: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  return (
    <motion.div
      className={`min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br ${
        theme === "dark"
          ? "from-gray-900 to-gray-800 text-gray-100"
          : "from-primary to-secondary text-primary-content"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating book background elements */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute text-4xl ${
              theme === "dark" ? "text-gray-700" : "text-primary/20"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              rotate: Math.random() * 360,
            }}
            variants={floatVariants}
            animate="float"
          >
            <FaBook />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center max-w-2xl mx-4"
        variants={itemVariants}
      >
        {/* Main error content */}
        <motion.div variants={itemVariants}>
          <motion.div
            className="text-9xl mb-6"
            variants={floatVariants}
            animate="float"
          >
            📚
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-5xl font-bold mb-4"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          className="text-xl mb-8"
          variants={itemVariants}
          whileHover={{ x: 5 }}
        >
          The page you're looking for seems to have been misplaced in our
          library.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className={`btn btn-lg flex items-center ${
                theme === "dark" ? "btn-accent" : "btn-primary"
              }`}
            >
              <FaHome className="mr-2" />
              Return Home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/all-books"
              className={`btn btn-lg flex items-center ${
                theme === "dark" ? "btn-secondary" : "btn-accent"
              }`}
            >
              <FaBookOpen className="mr-2" />
              Browse Books
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/search"
              className={`btn btn-lg flex items-center ${
                theme === "dark" ? "btn-ghost" : "btn-secondary"
              }`}
            >
              <FaSearch className="mr-2" />
              Search Library
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated footer text */}
      <motion.div
        className={`absolute bottom-8 text-sm ${
          theme === "dark" ? "text-gray-400" : "text-primary-content/80"
        }`}
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        variants={itemVariants}
      >
        <p>Error Code: 404 - Book Not Found</p>
        <p className="mt-1">
          "Not all those who wander are lost, but you might be."
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ErrorPage;
