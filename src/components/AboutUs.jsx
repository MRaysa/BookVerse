import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { FaBookOpen, FaUsers, FaLightbulb, FaHeart } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";

const AboutUs = () => {
  const { theme } = useTheme();

  const teamMembers = [
    {
      name: "Aysa",
      role: "Founder & CEO",
      bio: "Book enthusiast with 10+ years in library management",
      animationDelay: 0.2,
    },
    {
      name: "Siddika",
      role: "Lead Developer",
      bio: "Passionate about creating seamless digital reading experiences",
      animationDelay: 0.4,
    },
    {
      name: "Meem",
      role: "Community Manager",
      bio: "Connects readers with their next favorite book",
      animationDelay: 0.6,
    },
  ];

  const stats = [
    { value: "10,000+", label: "Books Available", icon: <FaBookOpen /> },
    { value: "5,000+", label: "Active Members", icon: <FaUsers /> },
    { value: "2015", label: "Founded In", icon: <FaLightbulb /> },
    { value: "24/7", label: "Support", icon: <RiTeamFill /> },
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
        className={`py-20 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-md`}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`text-5xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-xl max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Connecting readers with their next favorite book since 2015. Our
            mission is to make reading accessible to everyone.
          </motion.p>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16">
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
                className={`p-8 rounded-xl text-center shadow-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div
                  className={`text-4xl mb-4 ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  {stat.icon}
                </div>
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
        className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
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
              <motion.h2
                className={`text-4xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                Our Mission
              </motion.h2>
              <motion.p
                className={`text-xl mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
                initial={{ x: -50 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
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
              <div
                className={`p-8 rounded-xl ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                } shadow-xl`}
              >
                <div className="text-6xl text-purple-500 mb-6">
                  <FaHeart />
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Why We Do It
                </h3>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Books have the power to change lives. We're here to make sure
                  everyone can experience that magic.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            className={`text-4xl font-bold mb-16 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: member.animationDelay }}
                className={`p-8 rounded-xl text-center shadow-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
                whileHover={{ y: -10 }}
              >
                <div className="w-32 h-32 mx-auto rounded-full bg-purple-100 mb-6 flex items-center justify-center text-purple-500 text-4xl">
                  <RiTeamFill />
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {member.name}
                </h3>
                <p
                  className={`text-lg mb-4 ${
                    theme === "dark" ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  {member.role}
                </p>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-20 ${
          theme === "dark" ? "bg-gray-800" : "bg-purple-600"
        }`}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className={`text-4xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-white"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Join Our Reading Community
          </motion.h2>
          <motion.p
            className={`text-xl mb-8 max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-purple-100"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Discover your next favorite book and connect with fellow readers
            today.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-lg font-bold ${
              theme === "dark"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-white hover:bg-gray-100"
            } ${theme === "dark" ? "text-white" : "text-purple-600"} shadow-lg`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Get Started
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
