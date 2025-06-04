import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router"; // Fixed import
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaHome,
  FaBook,
  FaPlusCircle,
  FaShoppingBasket,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

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
  ];

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/");
      setMobileMenuOpen(false);
      setProfileDropdownOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = "none";
  };

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className={`sticky top-0 z-50 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
      } shadow-lg`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <NavLink to="/" className="flex items-center space-x-2">
              <motion.div
                className="text-3xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  transition: { duration: 1, repeat: Infinity, repeatDelay: 5 },
                }}
              >
                📚
              </motion.div>
              <motion.span
                className="text-2xl font-extrabold hidden sm:inline-block"
                whileHover={{ scale: 1.05 }}
              >
                BookVerse
              </motion.span>
            </NavLink>
          </motion.div>

          {/* Desktop Navigation - Show on md screens and larger */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? theme === "dark"
                          ? "bg-gray-700 text-white shadow-lg"
                          : "bg-white text-indigo-600 shadow-lg"
                        : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-white hover:text-indigo-600 hover:bg-white hover:bg-opacity-20"
                    }`
                  }
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Right Section - Show on md screens and larger */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full p-1 flex items-center ${
                theme === "dark" ? "bg-gray-700" : "bg-white bg-opacity-20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <motion.div
                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                  theme === "dark"
                    ? "bg-yellow-300 translate-x-6"
                    : "bg-white translate-x-0"
                }`}
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                animate={{
                  rotate: theme === "dark" ? [0, 360] : [0, -360],
                  transition: { duration: 0.5 },
                }}
              >
                {theme === "dark" ? (
                  <FaSun className="text-gray-800 text-sm" />
                ) : (
                  <FaMoon className="text-indigo-600 text-sm" />
                )}
              </motion.div>
            </motion.button>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                >
                  {user.photoURL ? (
                    <motion.img
                      whileHover={{ rotate: 5 }}
                      className={`h-10 w-10 rounded-full object-cover border-2 ${
                        theme === "dark" ? "border-yellow-300" : "border-white"
                      }`}
                      src={user.photoURL}
                      alt="User profile"
                      onError={handleImageError}
                    />
                  ) : (
                    <motion.div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-yellow-300 text-gray-900"
                          : "bg-white text-indigo-600"
                      }`}
                      whileHover={{ rotate: 5 }}
                    >
                      <FaUser className="text-xl" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className={`origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      } z-50 overflow-hidden`}
                    >
                      <div className="py-1">
                        <div
                          className={`px-4 py-2 text-sm ${
                            theme === "dark" ? "text-gray-200" : "text-gray-700"
                          } border-b ${
                            theme === "dark"
                              ? "border-gray-700"
                              : "border-gray-200"
                          }`}
                        >
                          {user.displayName || "User"}
                        </div>
                        <motion.button
                          onClick={handleSignOut}
                          className={`flex items-center w-full px-4 py-2 text-sm ${
                            theme === "dark"
                              ? "text-red-400 hover:bg-gray-700"
                              : "text-red-600 hover:bg-gray-100"
                          }`}
                          whileHover={{ x: 5 }}
                        >
                          <FaSignOutAlt className="mr-2" />
                          Sign Out
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex space-x-3">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <NavLink
                    to="/signin"
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-full font-medium ${
                        isActive
                          ? theme === "dark"
                            ? "bg-yellow-300 text-gray-900"
                            : "bg-white text-indigo-600"
                          : theme === "dark"
                          ? " text-white hover:bg-gray-600"
                          : " bg-opacity-20 text-white hover:bg-opacity-30"
                      }`
                    }
                  >
                    <FaSignInAlt className="mr-2" />
                    Login
                  </NavLink>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-full font-medium ${
                        isActive
                          ? theme === "dark"
                            ? "bg-yellow-300 text-gray-900"
                            : "bg-white text-indigo-600"
                          : theme === "dark"
                          ? " text-white hover:bg-gray-700"
                          : " text-white hover:bg-indigo-100 hover:text-indigo-500"
                      }`
                    }
                  >
                    <FaUserPlus className="mr-2" />
                    Register
                  </NavLink>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button - Show on screens smaller than lg */}
          <motion.div
            className="lg:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-full ${
                theme === "dark"
                  ? "text-yellow-300 hover:bg-gray-800"
                  : "text-white hover:bg-white hover:bg-opacity-20"
              } focus:outline-none`}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden shadow-xl rounded-b-2xl overflow-hidden ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * navLinks.indexOf(link) }}
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg text-base font-medium ${
                        isActive
                          ? theme === "dark"
                            ? "bg-yellow-300 text-gray-900"
                            : "bg-indigo-600 text-white"
                          : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.name}
                    {location.pathname === link.path && (
                      <motion.span
                        className="ml-auto h-2 w-2 rounded-full bg-white"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                  </NavLink>
                </motion.div>
              ))}

              {/* Mobile Auth Section */}
              <div
                className={`pt-4 pb-2 border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {user ? (
                  <>
                    <div className="flex items-center px-4 py-3">
                      <div className="flex-shrink-0">
                        {user.photoURL ? (
                          <img
                            className={`h-10 w-10 rounded-full border-2 ${
                              theme === "dark"
                                ? "border-yellow-300"
                                : "border-indigo-600"
                            }`}
                            src={user.photoURL}
                            alt="User profile"
                            onError={handleImageError}
                          />
                        ) : (
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              theme === "dark"
                                ? "bg-yellow-300 text-gray-900"
                                : "bg-indigo-600 text-white"
                            }`}
                          >
                            <FaUser className="text-xl" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          {user.displayName || "User"}
                        </div>
                        <div
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-3 mt-2 rounded-lg ${
                        theme === "dark"
                          ? "text-red-400 hover:bg-gray-700"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      <FaSignOutAlt className="mr-3" />
                      Sign Out
                    </motion.button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 px-2">
                    <motion.div whileHover={{ scale: 1.03 }}>
                      <NavLink
                        to="/signin"
                        onClick={handleMobileLinkClick}
                        className={({ isActive }) =>
                          `flex items-center justify-center px-4 py-2 rounded-full font-medium ${
                            isActive
                              ? theme === "dark"
                                ? "bg-yellow-300 text-gray-900"
                                : "bg-indigo-600 text-white"
                              : theme === "dark"
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`
                        }
                      >
                        <FaSignInAlt className="mr-2" />
                        Login
                      </NavLink>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }}>
                      <NavLink
                        to="/signup"
                        onClick={handleMobileLinkClick}
                        className={({ isActive }) =>
                          `flex items-center justify-center px-4 py-2 rounded-full font-medium ${
                            isActive
                              ? theme === "dark"
                                ? "bg-yellow-300 text-gray-900"
                                : "bg-white text-indigo-600"
                              : theme === "dark"
                              ? "border border-yellow-300 text-yellow-300 hover:bg-gray-700"
                              : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                          }`
                        }
                      >
                        <FaUserPlus className="mr-2" />
                        Register
                      </NavLink>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Theme Toggle - Mobile */}
              <div className="px-4 py-3">
                <motion.button
                  onClick={toggleTheme}
                  className={`flex items-center justify-center w-full px-4 py-2 rounded-full ${
                    theme === "dark"
                      ? "bg-gray-700 text-yellow-300"
                      : "bg-indigo-100 text-indigo-600"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {theme === "dark" ? (
                    <>
                      <FaSun className="mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <FaMoon className="mr-2" />
                      Dark Mode
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
