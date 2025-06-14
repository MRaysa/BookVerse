import React from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaBookReader } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

const ReadingChallenge = () => {
  const { theme } = useTheme();

  const progressVariants = {
    initial: { width: 0 },
    animate: {
      width: "65%",
      transition: { duration: 1.5, delay: 0.5 },
    },
  };

  const bookAnimation = {
    float: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className={`py-12 px-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-accent/10"
      }`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <motion.div
          className="md:w-1/2"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-8xl mb-6 text-primary"
            variants={bookAnimation}
            animate="float"
          >
            <FaBookReader />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-primary"> Join Our Reading Challenge</span>
          </h2>
          <p
            className={`text-lg mb-6 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Complete 12 books this year and win a special reader's badge!
          </p>
          <motion.button
            className={`btn btn-primary btn-lg flex items-center gap-2`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrophy />
            Join Challenge
          </motion.button>
        </motion.div>

        <motion.div
          className="md:w-1/2 w-full"
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div
            className={`p-6 rounded-xl shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between mb-2">
              <span
                className={`font-medium ${
                  theme === "dark" ? "text-white" : " text-gray-800"
                }`}
              >
                Your Progress
              </span>
              <span className="font-bold text-primary">65%</span>
            </div>
            <div
              className={`h-4 rounded-full ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } overflow-hidden`}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                variants={progressVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  theme === "dark" ? "bg-primary" : "bg-primary"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  theme === "dark" ? "text-white" : " text-gray-800"
                }`}
              >
                8 of 12 books completed
              </span>
            </div>
            <motion.div
              className="mt-6 grid grid-cols-4 gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2 rounded-full ${
                    i < 8
                      ? "bg-primary"
                      : theme === "dark"
                      ? "bg-gray-600"
                      : "bg-gray-300"
                  }`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: i * 0.05 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReadingChallenge;
