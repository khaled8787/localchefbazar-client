import React, { useContext, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase.init";

const LoginPage = () => {
  const { signInUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit, setValue } = useForm();
  const faceRef = useRef(null);

  /* ---------------- Eye Animation ---------------- */
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const smoothX = useSpring(eyeX, { stiffness: 120, damping: 15 });
  const smoothY = useSpring(eyeY, { stiffness: 120, damping: 15 });

  const [blink, setBlink] = useState(false);
  const [smile, setSmile] = useState(false);
  const [hideEyes, setHideEyes] = useState(false);

  useEffect(() => {
    let timeoutId;
    const blinkCycle = () => {
      const interval = Math.random() * 4000 + 3000;
      timeoutId = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 180);
        blinkCycle();
      }, interval);
    };
    const initial = setTimeout(blinkCycle, 1000);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initial);
    };
  }, []);

  const lookAt = (e) => {
    if (!faceRef.current) return;
    const face = faceRef.current.getBoundingClientRect();
    const input = e.target.getBoundingClientRect();
    const dx = input.left + input.width / 2 - (face.left + face.width / 2);
    const dy = input.top + input.height / 2 - (face.top + face.height / 2);
    eyeX.set(Math.max(Math.min(dx / 15, 12), -12));
    eyeY.set(Math.max(Math.min(dy / 15, 12), -12));
    setSmile(true);
    if (e.target.type === "password") setHideEyes(true);
  };

  const resetLook = () => {
    eyeX.set(0);
    eyeY.set(0);
    setSmile(false);
    setHideEyes(false);
  };

  /* ---------------- Save User to DB ---------------- */
  const saveUserToDB = async (user) => {
    await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.displayName || "Anonymous",
        email: user.email,
        photoURL:
          user.photoURL ||
          "https://i.ibb.co/2Yf6s0b/default-avatar.png",
        role: "user",
        status: "active",
      }),
    });
  };

  /* ---------------- Email Login ---------------- */
  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      await saveUserToDB(result.user);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Google Login ---------------- */
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUserToDB(result.user);
      toast.success("Google login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ---------------- Demo Login ---------------- */
  const handleDemoLogin = () => {
    setValue("email", "mdkhaledmahmud017@gmail.com");
    setValue("password", "Khaled1@");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">

      {/* LEFT */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-5">
          <h2 className="text-3xl font-bold text-center">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-xl border"
              onFocus={lookAt}
              onBlur={resetLook}
            />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border"
              onFocus={lookAt}
              onBlur={resetLook}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            onClick={handleDemoLogin}
            className="w-full py-2 rounded-xl border font-medium"
          >
            Demo Login
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium">
              Register
            </Link>
          </p>
        </div>
      </motion.div>

      {/* RIGHT */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex items-center justify-center"
      >
        <div
          ref={faceRef}
          className="relative w-64 h-64 bg-yellow-200 rounded-full shadow-xl flex items-center justify-center"
        >
          {!hideEyes && (
            <motion.div
              style={{ x: smoothX, y: smoothY }}
              animate={{ scaleY: blink ? 0.1 : 1 }}
              className="flex gap-6"
            >
              <div className="w-6 h-6 bg-black rounded-full" />
              <div className="w-6 h-6 bg-black rounded-full" />
            </motion.div>
          )}
          <div
            className={`absolute bottom-16 w-16 h-2 bg-black rounded-full transition-all ${
              smile ? "scale-x-125 rotate-6" : ""
            }`}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
