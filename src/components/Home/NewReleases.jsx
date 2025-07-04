import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaBookOpen } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

const NewReleases = () => {
  const { theme } = useTheme();

  const releases = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      date: "2023-06-15",
      cover:
        "https://static-01.daraz.com.bd/p/505b053755f513348d36ed15ca616075.jpg",
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      date: "2023-05-22",
      cover: "https://cdn2.penguin.com.au/covers/original/9781529157468.jpg",
    },
    {
      id: 3,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      date: "2023-04-10",
      cover:
        "https://www.practicalradonc.org/cms/10.1016/j.prro.2023.10.015/asset/a4847579-dff9-449e-881b-fdcf710e5985/main.assets/gr1_lrg.jpg",
    },
    {
      id: 4,
      title: "The Four Winds",
      author: "Kristin Hannah",
      date: "2023-03-05",
      cover: "https://dynamic.indigoimages.ca/v1/books/books/1250178614/1.jpg",
    },
  ];

  return (
    <section
      className={`py-16 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className={theme === "dark" ? "text-white" : "text-gray-800"}>
            New{" "}
          </span>
          <span className="text-purple-500">Releases</span>
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div
            className={`absolute left-1/2 h-full w-1 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-300"
            } transform -translate-x-1/2`}
          />

          <div className="space-y-12">
            {releases.map((release, index) => (
              <motion.div
                key={release.id}
                className={`relative pl-8 pr-8 md:pl-0 md:pr-0 ${
                  index % 2 === 0 ? "md:text-right" : "md:text-left"
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div
                  className={`flex ${
                    index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                  } items-center gap-8`}
                >
                  <div
                    className={`md:w-1/2 ${
                      index % 2 === 0 ? "md:pl-8" : "md:pr-8"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 rounded-xl shadow-lg ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FaCalendarAlt className="text-purple-500" />
                        <span
                          className={`font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {new Date(release.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h3
                        className={`text-xl font-bold mb-1 ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {release.title}
                      </h3>
                      <p
                        className={`mb-3 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        by {release.author}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                          theme === "dark"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-purple-500 hover:bg-purple-600"
                        } text-white text-sm`}
                      >
                        <FaBookOpen />
                        Reserve Now
                      </motion.button>
                    </motion.div>
                  </div>

                  <div className="hidden md:block md:w-1/2">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      className={`overflow-hidden rounded-lg shadow-xl ${
                        theme === "dark" ? "ring-2 ring-purple-500" : ""
                      }`}
                    >
                      <img
                        src={release.cover}
                        alt={release.title}
                        className="w-full h-64 object-cover"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Timeline dot */}
                <div
                  className={`absolute top-1/2 left-1/2 w-6 h-6 rounded-full ${
                    theme === "dark" ? "bg-purple-500" : "bg-purple-400"
                  } transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      theme === "dark" ? "bg-gray-900" : "bg-white"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewReleases;
