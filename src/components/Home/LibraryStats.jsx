import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaBook,
  FaUser,
  FaChartBar,
  FaRegClock,
  FaBookOpen,
  FaUsers,
  FaHistory,
  FaRegCalendarAlt,
} from "react-icons/fa";
import CountUp from "react-countup";
import { useTheme } from "../../contexts/ThemeContext";

const LibraryStats = () => {
  const { theme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  const stats = [
    {
      icon: <FaBookOpen className="text-4xl" />,
      value: 12543,
      label: "Books Available",
      description: "From classics to contemporary bestsellers",
      color: "text-purple-500",
      bgColor: theme === "dark" ? "bg-purple-900/30" : "bg-purple-100",
    },
    {
      icon: <FaUsers className="text-4xl" />,
      value: 8421,
      label: "Active Members",
      description: "Join our growing community of readers",
      color: "text-blue-500",
      bgColor: theme === "dark" ? "bg-blue-900/30" : "bg-blue-100",
    },
    {
      icon: <FaHistory className="text-4xl" />,
      value: 320000,
      label: "Books Borrowed",
      description: "Knowledge shared across generations",
      color: "text-green-500",
      bgColor: theme === "dark" ? "bg-green-900/30" : "bg-green-100",
    },
    {
      icon: <FaRegCalendarAlt className="text-4xl" />,
      value: 97,
      label: "New Arrivals",
      description: "Fresh titles added weekly",
      color: "text-orange-500",
      bgColor: theme === "dark" ? "bg-orange-900/30" : "bg-orange-100",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    hover: {
      y: -10,
      boxShadow:
        theme === "dark"
          ? "0 25px 50px -12px rgba(168, 85, 247, 0.3)"
          : "0 25px 50px -12px rgba(79, 70, 229, 0.3)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const floatingBook = {
    initial: { y: -20, rotate: -5 },
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      ref={ref}
      className={`relative py-20 px-4 overflow-hidden ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 text-6xl opacity-10"
        variants={floatingBook}
        initial="initial"
        animate="animate"
      >
        📚
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-6xl opacity-10"
        variants={floatingBook}
        initial="initial"
        animate="animate"
        transition={{ delay: 2 }}
      >
        📖
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <span className={theme === "dark" ? "text-white" : "text-gray-800"}>
              Discover Our{" "}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Library Universe
            </span>
          </motion.h2>
          <motion.p
            className={`text-xl max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            Where numbers tell the story of our literary community's growth and
            impact
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover="hover"
              className={`relative rounded-2xl p-8 text-center overflow-hidden transition-all duration-300 ${
                stat.bgColor
              } ${theme === "dark" ? "shadow-xl" : "shadow-lg"}`}
            >
              {/* Animated background element */}
              <motion.div
                className={`absolute -z-0 w-32 h-32 rounded-full ${stat.color} opacity-10`}
                initial={{ scale: 0, x: -50, y: -50 }}
                animate={{
                  scale: 2,
                  x: [0, 50, 0],
                  y: [0, 30, 0],
                  transition: {
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }}
              />

              <motion.div
                className={`inline-flex items-center justify-center p-5 rounded-full mb-6 ${stat.color} ${stat.bgColor} shadow-md`}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  rotate: [0, 10, -10, 0],
                  transition: {
                    duration: 0.8,
                    delay: index * 0.2 + 0.4,
                  },
                }}
                whileHover={{
                  rotate: 360,
                  transition: { duration: 1 },
                }}
              >
                {stat.icon}
              </motion.div>

              <motion.h3
                className={`text-5xl font-bold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: index * 0.2 + 0.6 },
                }}
              >
                {isInView && (
                  <CountUp
                    end={stat.value}
                    duration={3}
                    separator=","
                    suffix={index === 3 ? "+" : ""}
                  />
                )}
              </motion.h3>
              <motion.h4
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: index * 0.2 + 0.8 },
                }}
              >
                {stat.label}
              </motion.h4>

              <motion.p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: index * 0.2 + 1 },
                }}
              >
                {stat.description}
              </motion.p>

              {/* Animated progress indicator */}
              <motion.div
                className={`h-1 mt-4 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                } rounded-full overflow-hidden`}
                initial={{ width: 0 }}
                animate={{
                  width: "100%",
                  transition: { delay: index * 0.2 + 1.2, duration: 2 },
                }}
              >
                <motion.div
                  className={`h-full ${stat.color.replace("text", "bg")}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: "100%",
                    transition: {
                      delay: index * 0.2 + 1.5,
                      duration: 2,
                      ease: "easeInOut",
                    },
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated call-to-action */}
        <motion.div
          className={`mt-16 p-8 rounded-2xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-xl text-center`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
        >
          <motion.h3
            className={`text-2xl md:text-3xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
            animate={{
              scale: [1, 1.02, 1],
              transition: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          >
            Ready to join our reading community?
          </motion.h3>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-4 rounded-full font-bold text-lg ${
              theme === "dark"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            } text-white shadow-lg`}
          >
            Become a Member Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default LibraryStats;
