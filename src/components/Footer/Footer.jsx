import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaHeart,
  FaHome,
  FaBook,
  FaPlusCircle,
  FaShoppingBasket,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";

const Footer = () => {
  const { theme } = useTheme();

  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome className="text-lg" />,
    },
    {
      name: "All Books",
      path: "/all-books",
      icon: <FaBook className="text-lg" />,
    },
    {
      name: "Add Book",
      path: "/add-book",
      icon: <FaPlusCircle className="text-lg" />,
    },
    {
      name: "Borrowed",
      path: "/borrowed-books",
      icon: <FaShoppingBasket className="text-lg" />,
    },
    {
      name: "My All Books",
      path: "/my-all-books",
      icon: <FaBook className="text-lg" />,
    },
    {
      name: "About Us",
      path: "/aboutUs",
      icon: <FaBook className="text-lg" />,
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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

          {/* Navigation Links */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-semibold">Navigation</h3>
            <motion.ul className="space-y-3">
              {navLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-200"
                    }`}
                  >
                    {link.icon}
                  </span>
                  <a
                    href={link.path}
                    className="text-sm hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Quick links */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-semibold">Quick Access</h3>
            <motion.ul className="space-y-3">
              {[
                "Popular Books",
                "New Arrivals",
                "Featured Authors",
                "Reading Lists",
              ].map((link, index) => (
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
              ))}
            </motion.ul>
          </motion.div>

          {/* Social links */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <motion.div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full flex items-center gap-2 ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-100 text-indigo-600"
                  } shadow-sm transition-all`}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  {social.icon}
                  <span className="text-sm">{social.name}</span>
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
            All rights reserved | Terms of Service | Privacy Policy
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
