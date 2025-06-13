import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

const Footer = () => {
  const { theme } = useTheme();

  const socialLinks = [
    {
      icon: <FaGithub className="text-xl" />,
      url: "https://github.com/yourusername",
      name: "GitHub",
    },
    {
      icon: <FaLinkedin className="text-xl" />,
      url: "https://linkedin.com/in/yourusername",
      name: "LinkedIn",
    },
    {
      icon: <FaTwitter className="text-xl" />,
      url: "https://twitter.com/yourusername",
      name: "Twitter",
    },
    {
      icon: <FiMail className="text-xl" />,
      url: "mailto:youremail@example.com",
      name: "Email",
    },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.footer
      className={`pt-12 pb-8 px-4 sm:px-6 lg:px-8 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
      }`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={footerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-3xl">📚</span>
              <span className="text-2xl font-bold">BookVerse</span>
            </motion.div>
            <motion.p className="text-sm" whileHover={{ x: 5 }}>
              Your ultimate digital library experience. Find, borrow, and manage
              books with ease.
            </motion.p>
          </motion.div>

          {/* Quick links */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <motion.ul className="space-y-2">
              {["Home", "All Books", "Add Book", "Borrowed Books"].map(
                (link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href={`#${link.toLowerCase().replace(" ", "-")}`}
                      className="text-sm hover:text-accent transition-colors"
                    >
                      {link}
                    </a>
                  </motion.li>
                )
              )}
            </motion.ul>
          </motion.div>

          {/* Social links */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <motion.div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-200 text-indigo-500"
                  } shadow-sm`}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="mt-12 pt-6 border-t border-opacity-20 text-center text-sm"
          variants={itemVariants}
        >
          <p className="flex items-center justify-center">
            Made with <FaHeart className="mx-1 text-red-500 animate-pulse" /> by
            Aysa Siddika Meem © {new Date().getFullYear()}
          </p>
          <motion.p className="mt-2" whileHover={{ scale: 1.02 }}>
            All rights reserved
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
