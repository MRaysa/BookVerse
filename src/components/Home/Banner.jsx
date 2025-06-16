import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBookOpen,
  FaSearch,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

const Banner = () => {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides = [
    {
      title: "Discover Your Next Adventure",
      subtitle: "Explore our vast collection of books",
      icon: <FaBookOpen className="text-5xl" />,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72_E1XDsFA579sB6NlAMHAJQcOmCot4DMoHioHeT5YDNvw3blnpGHxXhOGKB1P73rui0&usqp=CAU",
      overlay:
        theme === "dark" ? "rgba(76, 29, 149, 0.7)" : "rgba(109, 40, 217, 0.7)",
    },
    {
      title: "Find Your Perfect Read",
      subtitle: "Advanced search at your fingertips",
      icon: <FaSearch className="text-5xl" />,
      image:
        "https://assets.penguinrandomhouse.com/wp-content/uploads/2021/06/10164043/PRH-Backlist-Outdoors-ReadDown-Main_Site-KN-1200x628-04_25.jpg",
      overlay:
        theme === "dark" ? "rgba(30, 58, 138, 0.7)" : "rgba(37, 99, 235, 0.7)",
    },
    {
      title: "Borrow With Ease",
      subtitle: "Simple process for all members",
      icon: <FaBookOpen className="text-5xl" />,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwcob_IynFmUEeGmWH1yDFoAZC0-eJ3CPz1fWG0NF4PdOkYSlo09yntvv8eWMUW4SJEL8&usqp=CAU",
      overlay:
        theme === "dark" ? "rgba(17, 94, 89, 0.7)" : "rgba(20, 184, 166, 0.7)",
    },
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0.5,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0.5,
      scale: 0.95,
    }),
  };

  return (
    <div className="relative h-96 overflow-hidden  shadow-2xl ">
      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute left-4 top-1/2 z-20 p-3 rounded-full ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } shadow-lg transform -translate-y-1/2`}
        aria-label="Previous slide"
      >
        <FaArrowLeft />
      </motion.button>

      <motion.button
        onClick={nextSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute right-4 top-1/2 z-20 p-3 rounded-full ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } shadow-lg transform -translate-y-1/2`}
        aria-label="Next slide"
      >
        <FaArrowRight />
      </motion.button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            whileHover={{ scale: 1.2 }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? theme === "dark"
                  ? "bg-white w-6"
                  : "bg-gray-800 w-6"
                : theme === "dark"
                ? "bg-gray-500"
                : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slides */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundColor: slides[currentSlide].overlay,
              backgroundBlendMode: "multiply",
            }}
          />

          {/* Floating book animation */}
          <motion.div
            initial={{ y: -20, rotate: -10, opacity: 0.3 }}
            animate={{ y: 20, rotate: 10, opacity: 0.2 }}
            transition={{
              y: {
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              rotate: {
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
            className="absolute left-1/4 top-1/4 text-6xl"
          >
            📚
          </motion.div>

          <motion.div
            initial={{ y: 20, rotate: 10, opacity: 0.3 }}
            animate={{ y: -20, rotate: -10, opacity: 0.2 }}
            transition={{
              y: {
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              rotate: {
                duration: 12,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
            className="absolute right-1/4 bottom-1/4 text-6xl"
          >
            📖
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8"
          >
            <motion.div
              className="mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {slides[currentSlide].icon}
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.button
              className={`px-8 py-3 rounded-full font-bold text-lg ${
                theme === "dark"
                  ? "bg-white text-gray-900 hover:bg-gray-100"
                  : "bg-white text-indigo-700 hover:bg-gray-100"
              } shadow-lg`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Explore Now
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Banner;
