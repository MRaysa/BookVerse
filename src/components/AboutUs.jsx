import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import {
  FaBookOpen,
  FaUsers,
  FaLightbulb,
  FaHeart,
  FaQuoteLeft,
  FaGlobeAmericas,
  FaBookReader,
  FaHandsHelping,
} from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { GiBookshelf, GiSpellBook } from "react-icons/gi";
import { IoMdColorPalette } from "react-icons/io";
import { BsGraphUp } from "react-icons/bs";

const AboutUs = () => {
  const { theme } = useTheme();

  const teamMembers = [
    {
      name: "Aysa",
      role: "Founder & CEO",
      bio: "Book enthusiast with 10+ years in library management",
      animationDelay: 0.2,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      icon: <GiBookshelf className="text-4xl" />,
    },
    {
      name: "Siddika",
      role: "Lead Developer",
      bio: "Passionate about creating seamless digital reading experiences",
      animationDelay: 0.4,
      color: "bg-gradient-to-r from-blue-500 to-teal-400",
      icon: <GiSpellBook className="text-4xl" />,
    },
    {
      name: "Meem",
      role: "Community Manager",
      bio: "Connects readers with their next favorite book",
      animationDelay: 0.6,
      color: "bg-gradient-to-r from-orange-500 to-yellow-400",
      icon: <FaBookReader className="text-4xl" />,
    },
  ];

  const stats = [
    {
      value: "10,000+",
      label: "Books Available",
      icon: <FaBookOpen />,
      color: "text-purple-500",
    },
    {
      value: "5,000+",
      label: "Active Members",
      icon: <FaUsers />,
      color: "text-blue-500",
    },
    {
      value: "2015",
      label: "Founded In",
      icon: <FaLightbulb />,
      color: "text-yellow-500",
    },
    {
      value: "24/7",
      label: "Support",
      icon: <RiTeamFill />,
      color: "text-green-500",
    },
  ];

  const features = [
    {
      title: "Global Reach",
      description: "Connecting readers from all around the world",
      icon: <FaGlobeAmericas className="text-3xl" />,
      color: "bg-gradient-to-r from-blue-400 to-cyan-400",
    },
    {
      title: "Diverse Collection",
      description: "Books from every genre and culture",
      icon: <IoMdColorPalette className="text-3xl" />,
      color: "bg-gradient-to-r from-purple-400 to-pink-400",
    },
    {
      title: "Growing Community",
      description: "Thousands of new members every month",
      icon: <BsGraphUp className="text-3xl" />,
      color: "bg-gradient-to-r from-green-400 to-teal-400",
    },
    {
      title: "Shared Passion",
      description: "United by our love for reading",
      icon: <FaHandsHelping className="text-3xl" />,
      color: "bg-gradient-to-r from-orange-400 to-yellow-400",
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative py-32 overflow-hidden ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-gradient-to-r from-purple-500 to-indigo-600"
        }`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-block mb-6"
          >
            <span
              className={`px-4 py-2 rounded-full ${
                theme === "dark"
                  ? "bg-purple-900 text-purple-200"
                  : "bg-white/20 text-white"
              } text-sm font-medium`}
            >
              Our Story
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className={`text-5xl md:text-6xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-white"
            }`}
          >
            Turning Pages,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">
              Changing Lives
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-xl max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-purple-100"
            }`}
          >
            Connecting readers with their next favorite book since 2015. Our
            mission is to make reading accessible to everyone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-full font-bold ${
                theme === "dark"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-white hover:bg-gray-100 text-purple-600"
              } shadow-lg transition-all`}
            >
              Join Our Community
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { y: 50, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{ y: -10 }}
                className={`p-8 rounded-xl text-center shadow-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } border-t-4 ${stat.color.replace("text", "border")}`}
              >
                <div className={`text-4xl mb-4 ${stat.color}`}>{stat.icon}</div>
                <h3
                  className={`text-3xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {stat.value}
                </h3>
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        className={`py-20 ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-gradient-to-br from-gray-50 to-purple-50"
        }`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="lg:w-1/2">
              <motion.div
                initial={{ x: -50 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <span
                  className={`px-4 py-2 rounded-full ${
                    theme === "dark"
                      ? "bg-purple-900 text-purple-200"
                      : "bg-purple-100 text-purple-600"
                  } text-sm font-medium mb-4 inline-block`}
                >
                  Our Purpose
                </span>
                <motion.h2
                  className={`text-4xl font-bold mb-6 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  Why We{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    Exist
                  </span>
                </motion.h2>
              </motion.div>

              <motion.div
                initial={{ x: -50 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full ${
                      theme === "dark"
                        ? "bg-purple-900 text-purple-300"
                        : "bg-purple-100 text-purple-600"
                    } mt-1`}
                  >
                    <FaQuoteLeft />
                  </div>
                  <p
                    className={`text-xl italic ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Books are a uniquely portable magic. We're here to help you
                    discover that magic.
                  </p>
                </div>
              </motion.div>

              <motion.p
                className={`text-xl mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
                initial={{ x: -50 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                To create a world where everyone has access to the books they
                love, fostering a community of passionate readers.
              </motion.p>

              <motion.p
                className={`text-xl ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
                initial={{ x: -50 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                We believe in the transformative power of reading and strive to
                make it accessible to all.
              </motion.p>
            </div>

            <motion.div
              className="lg:w-1/2"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <div
                  className={`absolute -inset-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-lg`}
                ></div>
                <div
                  className={`relative p-8 rounded-xl ${
                    theme === "dark" ? "bg-gray-700" : "bg-white"
                  } shadow-xl`}
                >
                  <div className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
                    <FaHeart />
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Our Core Values
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span
                        className={`p-2 rounded-full ${
                          theme === "dark"
                            ? "bg-purple-900 text-purple-300"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        <FaBookOpen className="text-lg" />
                      </span>
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Accessibility for all readers
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className={`p-2 rounded-full ${
                          theme === "dark"
                            ? "bg-purple-900 text-purple-300"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        <FaUsers className="text-lg" />
                      </span>
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Community building
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span
                        className={`p-2 rounded-full ${
                          theme === "dark"
                            ? "bg-purple-900 text-purple-300"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        <FaLightbulb className="text-lg" />
                      </span>
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Innovation in reading experiences
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className={`px-4 py-2 rounded-full ${
                theme === "dark"
                  ? "bg-purple-900 text-purple-200"
                  : "bg-purple-100 text-purple-600"
              } text-sm font-medium mb-4 inline-block`}
            >
              What Makes Us Special
            </span>
            <h2
              className={`text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                Unique
              </span>{" "}
              Features
            </h2>
            <p
              className={`max-w-2xl mx-auto text-xl ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Discover what sets us apart in the world of book communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div
                  className={`h-full p-6 rounded-xl ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                  } shadow-lg border border-transparent group-hover:border-purple-300 transition-all`}
                >
                  <div
                    className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center text-white mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        className={`py-20 ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-gradient-to-br from-purple-50 to-indigo-50"
        }`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className={`px-4 py-2 rounded-full ${
                theme === "dark"
                  ? "bg-purple-900 text-purple-200"
                  : "bg-purple-100 text-purple-600"
              } text-sm font-medium mb-4 inline-block`}
            >
              The Faces Behind
            </span>
            <h2
              className={`text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
                Dream Team
              </span>
            </h2>
            <p
              className={`max-w-2xl mx-auto text-xl ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Passionate individuals dedicated to creating the best reading
              experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: member.animationDelay }}
                className="group"
                whileHover={{ y: -10 }}
              >
                <div
                  className={`h-full p-8 rounded-xl ${
                    theme === "dark" ? "bg-gray-700" : "bg-white"
                  } shadow-lg overflow-hidden relative`}
                >
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div
                    className={`w-32 h-32 mx-auto rounded-full ${member.color} mb-6 flex items-center justify-center text-white relative z-10`}
                  >
                    {member.icon}
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-2 text-center ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {member.name}
                  </h3>
                  <p
                    className={`text-lg mb-4 text-center font-medium ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {member.role}
                  </p>
                  <p
                    className={`text-center ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-20 ${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-800 to-gray-900"
            : "bg-gradient-to-r from-purple-600 to-indigo-600"
        }`}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className={`text-4xl font-bold mb-6 text-white`}>
              Ready to Begin Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">
                Reading Journey
              </span>
              ?
            </h2>
            <motion.p
              className={`text-xl mb-8 max-w-3xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-purple-100"
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of readers discovering new worlds every day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-full font-bold bg-white hover:bg-gray-100 text-purple-600 shadow-lg transition-all`}
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-full font-bold ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                } shadow-lg transition-all`}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
