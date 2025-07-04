import React, { useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaBookReader,
  FaRegClock,
  FaPenFancy,
  FaArrowRight,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

const EventsSection = () => {
  const { theme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const events = [
    {
      title: "Author Meet & Greet",
      date: "15 Oct 2023",
      time: "2:00 PM",
      icon: <FaChalkboardTeacher className="text-4xl" />,
      description:
        "Meet bestselling author Sarah Johnson as she discusses her latest novel",
      color: "text-purple-500",
      bgColor: theme === "dark" ? "bg-purple-900/20" : "bg-purple-100",
      spots: 12,
    },
    {
      title: "Creative Writing Workshop",
      date: "22 Oct 2023",
      time: "4:00 PM",
      icon: <FaPenFancy className="text-4xl" />,
      description: "Learn the art of storytelling from award-winning writers",
      color: "text-blue-500",
      bgColor: theme === "dark" ? "bg-blue-900/20" : "bg-blue-100",
      spots: 8,
    },
    {
      title: "Children's Story Hour",
      date: "Every Saturday",
      time: "10:00 AM",
      icon: <FaBookReader className="text-4xl" />,
      description: "Interactive reading sessions for children aged 3-8",
      color: "text-green-500",
      bgColor: theme === "dark" ? "bg-green-900/20" : "bg-green-100",
      spots: 20,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      y: -15,
      boxShadow:
        theme === "dark"
          ? "0 25px 50px -12px rgba(168, 85, 247, 0.3)"
          : "0 25px 50px -12px rgba(79, 70, 229, 0.3)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const floatingCalendar = {
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
        variants={floatingCalendar}
        initial="initial"
        animate="animate"
      >
        <FaRegCalendarCheck />
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-6xl opacity-10"
        variants={floatingCalendar}
        initial="initial"
        animate="animate"
        transition={{ delay: 2 }}
      >
        <FaCalendarAlt />
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
              Literary Events
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
            Join our vibrant community for unforgettable literary experiences
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {events.map((event, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover="hover"
              className={`relative rounded-2xl p-8 overflow-hidden transition-all duration-300 ${
                event.bgColor
              } ${theme === "dark" ? "shadow-xl" : "shadow-lg"}`}
            >
              {/* Animated background element */}
              <motion.div
                className={`absolute -z-0 w-32 h-32 rounded-full ${event.color} opacity-10`}
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

              <div className="relative z-10">
                <motion.div
                  className={`inline-flex items-center justify-center p-5 rounded-full mb-6 ${event.color} ${event.bgColor} shadow-md`}
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
                  {event.icon}
                </motion.div>

                <motion.h3
                  className={`text-2xl font-bold mb-3 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: index * 0.2 + 0.6 },
                  }}
                >
                  {event.title}
                </motion.h3>

                <motion.div
                  className="flex items-center gap-4 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: index * 0.2 + 0.8 },
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {event.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegClock
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {event.time}
                    </span>
                  </div>
                </motion.div>

                <motion.p
                  className={`mb-6 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: index * 0.2 + 1 },
                  }}
                >
                  {event.description}
                </motion.p>

                <div className="flex justify-between items-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: index * 0.2 + 1.2 },
                    }}
                  >
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        theme === "dark" ? "bg-gray-700" : "bg-white"
                      } ${
                        event.spots < 10 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {event.spots} spots left
                    </span>
                  </motion.div>

                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: theme === "dark" ? "#7c3aed" : "#6366f1",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.2 + 1.4 },
                    }}
                  >
                    Register <FaArrowRight />
                  </motion.button>
                </div>
              </div>
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
            Want to host your own event?
          </motion.h3>
          <motion.p
            className={`max-w-2xl mx-auto mb-6 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            We welcome community members to share their knowledge and passion
            for literature.
          </motion.p>
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
            Propose an Event
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
