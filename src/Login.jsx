import React, { useContext, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router";
import { motion, useMotionValue, useSpring } from "framer-motion";

const LoginPage = () => {
  const { signInUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { register, handleSubmit } = useForm();
  const faceRef = useRef(null);

  // Eye movement
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const smoothX = useSpring(eyeX, { stiffness: 120, damping: 15 });
  const smoothY = useSpring(eyeY, { stiffness: 120, damping: 15 });

  // Eye blink
  const [blink, setBlink] = useState(false);

  // Mouth smile
  const [smile, setSmile] = useState(false);

  // Password focus
  const [hideEyes, setHideEyes] = useState(false);

  // Natural random blink
  useEffect(() => {
    let timeoutId;

    const blinkCycle = () => {
      const interval = Math.random() * 4000 + 3000;
      timeoutId = setTimeout(() => {
        setBlink(true);
        const duration = Math.random() * 100 + 150;
        setTimeout(() => setBlink(false), duration);
        blinkCycle();
      }, interval);
    };

    // initial 1s delay
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

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);

    try {
      const userCredential = await signInUser(email, password);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">

      {/* LEFT – FORM */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-5">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Login
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {[
              { name: "email", placeholder: "Email Address", type: "email" },
              { name: "password", placeholder: "Password", type: "password" },
            ].map((field, i) => (
              <input
                key={i}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
                {...register(field.name)}
                onFocus={lookAt}
                onBlur={resetLook}
              />
            ))}

            <button
              type="submit"
              className={`w-full py-3 rounded-xl bg-blue-600 text-white font-semibold`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium">
              Register
            </Link>
          </p>
        </div>
      </motion.div>

      {/* RIGHT – INTERACTIVE CARTOON */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex items-center justify-center"
      >
        <div
          ref={faceRef}
          className="relative w-64 h-64 bg-yellow-200 rounded-full shadow-xl flex items-center justify-center"
        >
          {/* Eyes */}
          {!hideEyes && (
            <motion.div
              style={{ x: smoothX, y: smoothY }}
              initial={{ scaleY: 1 }}
              animate={{ scaleY: blink ? 0.1 : 1 }}
              transition={{ duration: 0.15 }}
              className="flex gap-6"
            >
              <div className="w-6 h-6 bg-black rounded-full" />
              <div className="w-6 h-6 bg-black rounded-full" />
            </motion.div>
          )}

          {/* Mouth */}
          <div
            className={`absolute bottom-16 w-16 h-2 bg-black rounded-full transition-all duration-200 ${smile ? "scale-x-125 rotate-6" : "scale-x-100 rotate-0"}`}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
