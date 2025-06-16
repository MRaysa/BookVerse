import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import signUpLottie from "../assets/lotties/signup.json";
import successLottie from "../assets/lotties/success.json";

const SignUp = () => {
  const { createUser, googleSignIn, updateUser, loading } =
    useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
    phone: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters with uppercase and lowercase";
    }
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (formData.photoURL && !isValidUrl(formData.photoURL)) {
      newErrors.photoURL = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, photoURL: url }));

    if (isValidUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, photoURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUserToDatabase = async (userProfile) => {
    try {
      const response = await fetch(
        "https://book-verse-server-sigma.vercel.app/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userProfile),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error saving user to database:", error);
      throw error;
    }
  };
  const showSuccessAlert = (userProfile) => {
    // Create style element for animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pop-in {
        0% { transform: scale(0.8); opacity: 0; }
        80% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .swal2-popup-custom {
        animation: pop-in 0.4s ease-out forwards !important;
      }
      .swal2-title-custom {
        font-size: 1.5rem !important;
        font-weight: bold !important;
        color: #7c3aed !important;
      }
      .swal2-confirm-custom {
        padding: 0.5rem 1rem !important;
        border-radius: 0.5rem !important;
      }
    `;
    document.head.appendChild(style);

    Swal.fire({
      title: "🎉 Account Created!",
      html: `
        <div style="text-align: center;">
          <div style="
            animation: bounce 1s infinite;
            font-size: 2.25rem;
            margin-bottom: 1rem;
          ">👋</div>
          <p style="font-size: 1.125rem; line-height: 1.75rem;">
            Welcome, <strong style="color: #7c3aed;">${
              userProfile.displayName || userProfile.name
            }</strong>!
          </p>
          <p style="margin-bottom: 1rem;">Your account is ready to go!</p>
          
          <div style="
            background-color: #eef2ff;
            border-radius: 0.5rem;
            padding: 1rem;
            text-align: left;
            animation: fade-in 0.6s ease-out forwards;
          ">
            <p style="display: flex; align-items: center; margin-bottom: 0.5rem;">
              <span style="margin-right: 0.5rem; font-size: 1.2em;">📧</span>
              <span><strong>Email:</strong> ${userProfile.email}</span>
            </p>
            ${
              userProfile.phoneNumber
                ? `<p style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                    <span style="margin-right: 0.5rem; font-size: 1.2em;">📱</span>
                    <span><strong>Phone:</strong> ${userProfile.phoneNumber}</span>
                  </p>`
                : ""
            }
            ${
              userProfile.address
                ? `<p style="display: flex; align-items: center;">
                    <span style="margin-right: 0.5rem; font-size: 1.2em;">🏠</span>
                    <span><strong>Address:</strong> ${userProfile.address}</span>
                  </p>`
                : ""
            }
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Let's Explore! 🚀",
      confirmButtonColor: "#8b5cf6",
      background: "#fff",
      customClass: {
        popup: "swal2-popup-custom",
        title: "swal2-title-custom",
        confirmButton: "swal2-confirm-custom",
      },
      didOpen: () => {
        // Add some cute confetti when the alert opens
        if (typeof window !== "undefined") {
          import("canvas-confetti").then((confetti) => {
            confetti.default({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          });
        }
      },
      willClose: () => {
        // Clean up the style element when alert closes
        document.head.removeChild(style);
      },
    }).then(() => {
      navigate("/");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userCredential = await createUser(
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Create a clean user profile object
      const userProfile = {
        uid: user.uid,
        displayName: formData.name,
        email: formData.email,
        photoURL: formData.photoURL || "",
        phoneNumber: formData.phone || "",
        address: formData.address || "",
        createdAt: new Date().toISOString(),
      };

      await updateUser({
        displayName: formData.name,
        photoURL: formData.photoURL || "",
      });

      const dbResponse = await saveUserToDatabase(userProfile);

      if (dbResponse.insertedId) {
        // Pass the properly formatted userProfile to the alert
        showSuccessAlert(userProfile);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({
        firebase: error.message || "An error occurred during signup",
      });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;

      const userProfile = {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        phoneNumber: "",
        address: "",
        createdAt: new Date().toISOString(),
      };

      await saveUserToDatabase(userProfile);
      navigate("/");
    } catch (error) {
      setErrors({ firebase: error.message || "Google sign-in failed" });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-purple-50"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden flex ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Lottie Animation Side */}
        <div
          className={`hidden md:flex w-1/2 p-8 items-center justify-center ${
            theme === "dark"
              ? "bg-gray-700"
              : "bg-gradient-to-br from-indigo-500 to-purple-600"
          }`}
        >
          <Lottie
            animationData={signUpLottie}
            loop={true}
            style={{ height: "100%", maxHeight: "600px" }}
          />
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="inline-block mb-4"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                  theme === "dark"
                    ? "bg-gray-600 text-indigo-300"
                    : "bg-indigo-100 text-indigo-600"
                }`}
              >
                <FaUser />
              </div>
            </motion.div>
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Create Account
            </h1>
            <p
              className={
                theme === "dark" ? "text-gray-400" : "text-gray-600 mt-2"
              }
            >
              Join our community today
            </p>
          </motion.div>

          {errors.firebase && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded ${
                theme === "dark"
                  ? "bg-red-900 text-red-200"
                  : "bg-red-100 text-red-700"
              } border-l-4 border-red-500`}
            >
              <p>{errors.firebase}</p>
            </motion.div>
          )}

          <div className="flex flex-col items-center space-y-2 mb-6">
            <div className="relative">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 ${
                  theme === "dark" ? "border-gray-600" : "border-indigo-100"
                }`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaImage
                    className={`text-3xl ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="upload-option"
                  name="image-option"
                  checked={!useImageUrl}
                  onChange={() => setUseImageUrl(false)}
                  className="mr-2"
                />
                <label
                  htmlFor="upload-option"
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Upload Image
                </label>
              </div>

              {!useImageUrl && (
                <label className="block w-full">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={`block w-full text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    } file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${
                      theme === "dark"
                        ? "file:bg-gray-600 file:text-white hover:file:bg-gray-500"
                        : "file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    }`}
                  />
                </label>
              )}

              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="url-option"
                  name="image-option"
                  checked={useImageUrl}
                  onChange={() => setUseImageUrl(true)}
                  className="mr-2"
                />
                <label
                  htmlFor="url-option"
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Use Image URL
                </label>
              </div>

              {useImageUrl && (
                <div className="mt-1">
                  <input
                    type="text"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-3 py-2 border rounded-md text-sm shadow-sm ${
                      errors.photoURL
                        ? "border-red-500"
                        : theme === "dark"
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.photoURL && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.photoURL}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className={`flex items-center text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <FaUser
                    className={`mr-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                    }`}
                  />
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                    errors.name
                      ? "border-red-500"
                      : theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className={`flex items-center text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <FaEnvelope
                    className={`mr-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                    }`}
                  />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                    errors.email
                      ? "border-red-500"
                      : theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300"
                  }`}
                  placeholder="your@email.com"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className={`flex items-center text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <FaLock
                    className={`mr-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                    }`}
                  />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      errors.password
                        ? "border-red-500"
                        : theme === "dark"
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }
                      />
                    ) : (
                      <FaEye
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }
                      />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                ) : (
                  <p
                    className={`text-xs mt-1 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Must be at least 6 characters with uppercase and lowercase
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="phone"
                  className={`flex items-center text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <FaPhone
                    className={`mr-2 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                    }`}
                  />
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                    errors.phone
                      ? "border-red-500"
                      : theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300"
                  }`}
                  placeholder="1234567890"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <label
                htmlFor="address"
                className={`flex items-center text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FaMapMarkerAlt
                  className={`mr-2 ${
                    theme === "dark" ? "text-indigo-400" : "text-indigo-500"
                  }`}
                />
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300"
                }`}
                placeholder="123 Main St, City, Country"
                rows="2"
              />
            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 5px 15px rgba(79, 70, 229, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                loading ? "bg-indigo-400" : "bg-indigo-600"
              } transition-all shadow-md flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block mr-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"
                      />
                    </svg>
                  </motion.span>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div
              className={`absolute inset-0 flex items-center ${
                theme === "dark" ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-400"
                    : "bg-white text-gray-500"
                }`}
              >
                Or sign up with
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2, boxShadow: "0 3px 10px rgba(0,0,0,0.1)" }}
            type="button"
            onClick={handleGoogleRegister}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-white hover:bg-gray-50"
            } transition border ${
              theme === "dark" ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="mr-3"
            >
              <FaGoogle className="text-red-500 text-xl" />
            </motion.div>
            <span
              className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
            >
              Continue with Google
            </span>
          </motion.button>

          <div
            className={`mt-6 text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p>
              Already have an account?{" "}
              <Link
                to="/signin"
                className={`font-medium ${
                  theme === "dark"
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-500"
                } hover:underline`}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
