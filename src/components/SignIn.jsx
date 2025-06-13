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
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Prepare sign-in info
      const signInInfo = {
        uid: user.uid,
        email: user.email,
        lastSignInTime: user.metadata.lastSignInTime,
      };

      // Update last sign-in time in database
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
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update sign-in time");
      }

      // Show themed success message
      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Signed in successfully",
        showConfirmButton: false,
        timer: 1500,
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
      });

      navigate(location?.state?.from || "/");
    } catch (error) {
      console.error("Sign-in error:", error);
      setError(error.message);

      let errorMessage = error.message;
      if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "User not found";
      }

      await Swal.fire({
        icon: "error",
        title: "Sign-in Failed",
        text: errorMessage,
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const updateResponse = await fetch(
        "https://book-verse-server-sigma.vercel.app/users",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            lastSignInTime: user.metadata.lastSignInTime,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update Google sign-in info");
      }

      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Signed in with Google",
        showConfirmButton: false,
        timer: 1500,
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
      });

      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);

      await Swal.fire({
        icon: "error",
        title: "Google Sign-in Failed",
        text: error.message,
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937",
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
