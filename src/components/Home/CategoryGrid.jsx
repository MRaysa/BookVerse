import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  FaBook,
  FaHistory,
  FaFlask,
  FaTheaterMasks,
  FaHeartbeat,
  FaUserSecret,
  FaFilm,
  FaRobot,
  FaFeatherAlt,
  FaHatWizard,
  FaBrain,
  FaPlaneDeparture,
} from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

const categories = [
  { name: "Fiction", icon: <FaTheaterMasks />, color: "text-purple-500" },
  { name: "Science", icon: <FaFlask />, color: "text-blue-500" },
  { name: "History", icon: <FaHistory />, color: "text-amber-500" },
  { name: "Health", icon: <FaHeartbeat />, color: "text-red-500" },
  { name: "Novel", icon: <FaBook />, color: "text-indigo-500" },
  { name: "Thriller", icon: <FaUserSecret />, color: "text-gray-700" },
  { name: "Drama", icon: <FaFilm />, color: "text-pink-500" },
  { name: "Sci-Fi", icon: <FaRobot />, color: "text-green-500" },
  { name: "Biography", icon: <FaFeatherAlt />, color: "text-yellow-600" },
  { name: "Fantasy", icon: <FaHatWizard />, color: "text-fuchsia-600" },
  { name: "Psychology", icon: <FaBrain />, color: "text-cyan-600" },
  { name: "Travel", icon: <FaPlaneDeparture />, color: "text-orange-500" },
];

const CategoryGrid = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/books?category=${encodeURIComponent(categoryName)}`);
  };
  return (
    <section
      className={`py-12 px-4 ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Explore Our{" "}
          <span
            className={theme === "dark" ? "text-purple-400" : "text-purple-600"}
          >
            Categories
          </span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.8 }}
              onClick={() => handleCategoryClick(category.name)}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl shadow-md flex flex-col items-center ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-100"
              } transition-all cursor-pointer`}
            >
              <motion.div
                className={`text-4xl mb-4 ${category.color}`}
                whileHover={{ rotate: 15, scale: 1.2 }}
              >
                {category.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-center">
                {category.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
