import React from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Book Club President",
    text: "This library system has transformed how our club discovers and shares books!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Avid Reader",
    text: "The easiest borrowing system I've ever used. 10/10 would recommend!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Student",
    text: "Saved me so much time finding resources for my research papers.",
    rating: 4,
  },
];

const Testimonials = () => {
  const { theme } = useTheme();

  return (
    <section
      className={`py-12 px-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          What Our{" "}
          <span
            className={theme === "dark" ? "text-teal-300" : "text-teal-600"}
          >
            Readers
          </span>{" "}
          Say
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl shadow-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <div
                className={`text-4xl mb-4 ${
                  theme === "dark" ? "text-purple-400" : "text-purple-500"
                }`}
              >
                <FaQuoteLeft />
              </div>
              <p className="text-lg mb-6 italic">{testimonial.text}</p>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < testimonial.rating
                        ? theme === "dark"
                          ? "text-yellow-300"
                          : "text-yellow-500"
                        : theme === "dark"
                        ? "text-gray-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div>
                <h4 className="font-bold">{testimonial.name}</h4>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
