import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaGoogle,
  FaFacebook,
  FaGithub,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import signInLottie from "../assets/lotties/signin.json";
import Lottie from "lottie-react";
import { useTheme } from "../contexts/ThemeContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef();
  const googleProvider = new GoogleAuthProvider();
  const { theme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First validate the inputs
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      // Attempt sign-in
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Prepare sign-in info
      const signInInfo = {
        uid: user.uid,
        email: user.email,
        lastSignInTime: user.metadata.lastSignInTime,
      };

      // Update last sign-in time in database
      try {
        const updateResponse = await fetch(
          "https://book-verse-server-sigma.vercel.app/users",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(signInInfo),
          }
        );

        if (!updateResponse.ok) {
          throw new Error("Failed to update sign-in time");
        }
      } catch (dbError) {
        console.error("Database update error:", dbError);
        // Continue with login even if database update fails
      }

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Signed in successfully",
        showConfirmButton: false,
        timer: 1500,
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
      });

      navigate(location?.state || "/");
    } catch (error) {
      console.error("Sign-in error:", error);

      let errorMessage = "Sign-in failed. Please try again.";
      if (error.code) {
        switch (error.code) {
          case "auth/wrong-password":
            errorMessage = "Incorrect password";
            break;
          case "auth/user-not-found":
            errorMessage = "No account found with this email";
            break;
          case "auth/too-many-requests":
            errorMessage =
              "Too many attempts. Try again later or reset your password";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address";
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);

      await Swal.fire({
        icon: "error",
        title: "Sign-in Failed",
        html: `
          <div style="text-align: center;">
            <p style="margin-bottom: 1rem;">${errorMessage}</p>
            ${
              error.code === "auth/wrong-password" ||
              error.code === "auth/user-not-found"
                ? '<button id="resetPassword" style="margin-top: 1rem; padding: 0.5rem 1rem; background-color: #8b5cf6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Reset Password</button>'
                : ""
            }
          </div>
        `,
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
        showConfirmButton: false,
        didOpen: () => {
          const resetBtn = document.getElementById("resetPassword");
          if (resetBtn) {
            resetBtn.addEventListener("click", () => {
              Swal.close();
              handleForgetPassword();
            });
          }
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Prepare user data for backend
      const userData = {
        uid: user.uid,
        email: user.email,
        lastSignInTime: user.metadata.lastSignInTime,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      // Try to update user info in backend
      try {
        const updateResponse = await fetch(
          "https://book-verse-server-sigma.vercel.app/users",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.warn(
            "Backend update warning:",
            errorData.message || "Update failed but user is logged in"
          );
        }
      } catch (dbError) {
        console.warn("Database update error:", dbError);
        // Continue with login even if database update fails
      }

      // Show success message with animation
      await Swal.fire({
        title: '<span style="font-size: 1.5rem">🎉 Welcome!</span>',
        html: `
          <div style="text-align: center; margin-top: 1rem;">
            <lottie-player 
              src="https://assets1.lottiefiles.com/packages/lf20_zkjfhrjt.json" 
              background="transparent" 
              speed="1" 
              style="width: 150px; height: 150px; margin: 0 auto;" 
              autoplay>
            </lottie-player>
            <p style="margin-top: 1rem; font-size: 1.1rem;">
              Signed in with Google as <strong>${
                user.displayName || user.email
              }</strong>
            </p>
          </div>
        `,
        showConfirmButton: false,
        timer: 2000,
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
        willOpen: () => {
          const script = document.createElement("script");
          script.src =
            "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
          document.head.appendChild(script);
        },
      });

      navigate(location?.state || "/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setLoading(false);

      let errorMessage = "Google sign-in failed. Please try again.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "You closed the sign-in window. Please try again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Connection to server failed. Please try again later.";
      }

      // Show error message with animation
      await Swal.fire({
        title:
          '<span style="font-size: 1.5rem">😕 Google Sign-in Failed</span>',
        html: `
          <div style="text-align: center;">
            <lottie-player 
              src="https://assets1.lottiefiles.com/packages/lf20_gn0to3lr.json" 
              background="transparent" 
              speed="1" 
              style="width: 120px; height: 120px; margin: 0 auto;" 
              autoplay>
            </lottie-player>
            <p style="margin: 1rem 0; font-size: 1.1rem;">${errorMessage}</p>
            <button id="tryAgain" style="
              margin-top: 0.5rem;
              padding: 0.5rem 1.5rem;
              background: linear-gradient(135deg, #8b5cf6, #6366f1);
              color: white;
              border: none;
              border-radius: 50px;
              cursor: pointer;
              font-weight: 500;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
            ">
              Try Again
            </button>
          </div>
        `,
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
        showConfirmButton: false,
        willOpen: () => {
          if (!document.querySelector('script[src*="lottie-player"]')) {
            const script = document.createElement("script");
            script.src =
              "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
            document.head.appendChild(script);
          }
        },
        didOpen: () => {
          const tryAgainBtn = document.getElementById("tryAgain");
          if (tryAgainBtn) {
            tryAgainBtn.addEventListener("click", () => {
              Swal.close();
              handleGoogleLogin();
            });
          }
        },
      });
    }
  };

  const handleForgetPassword = () => {
    const email = emailRef.current.value;
    setError("");

    if (!email) {
      setError("Please enter your email first");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Password Reset Sent",
          text: "Check your email for the reset link",
          background: theme === "dark" ? "#1f2937" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#1f2937",
        });
      })
      .catch((error) => {
        setError(error.message);
      });
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
        className={`w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Animation Side */}
        <div
          className={`hidden md:flex flex-1 p-8 items-center justify-center ${
            theme === "dark"
              ? "bg-gray-700"
              : "bg-gradient-to-br from-indigo-500 to-purple-600"
          }`}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <Lottie
              animationData={signInLottie}
              loop={true}
              style={{ height: "100%" }}
            />
          </motion.div>
        </div>

        {/* Form Side */}
        <div className="flex-1 p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-center mb-8 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
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
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p
              className={
                theme === "dark" ? "text-gray-400" : "text-gray-600 mt-2"
              }
            >
              Sign in to access your account
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded ${
                theme === "dark"
                  ? "bg-red-900 text-red-200"
                  : "bg-red-100 text-red-700"
              } border-l-4 border-red-500`}
            >
              <p>{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
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
                type="email"
                value={email}
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300"
                }`}
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  required
                  minLength="6"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={`h-4 w-4 ${
                    theme === "dark"
                      ? "text-indigo-400 bg-gray-600"
                      : "text-indigo-600"
                  } focus:ring-indigo-500 border-gray-300 rounded`}
                />
                <label
                  htmlFor="remember-me"
                  className={`ml-2 block text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgetPassword}
                className={`text-sm ${
                  theme === "dark"
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-500"
                }`}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
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
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>

            {/* Divider */}
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
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <motion.button
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleGoogleLogin}
                className={`flex items-center justify-center py-2 px-4 rounded-lg transition ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
                    : "bg-white hover:bg-gray-50 border-gray-300"
                } border`}
              >
                <FaGoogle className="text-red-500 text-xl mr-2" />
                Continue with Google
              </motion.button>
            </div>
          </form>

          {/* Footer */}
          <div
            className={`mt-6 text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className={`font-medium ${
                  theme === "dark"
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-500"
                } hover:underline`}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
