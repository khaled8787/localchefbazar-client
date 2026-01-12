import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase.init";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { motion, useMotionValue, useSpring } from "framer-motion";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const faceRef = useRef(null);

  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const smoothX = useSpring(eyeX, { stiffness: 120, damping: 15 });
  const smoothY = useSpring(eyeY, { stiffness: 120, damping: 15 });

  const [blink, setBlink] = useState(false);
  const [smile, setSmile] = useState(false);
  const [hideEyes, setHideEyes] = useState(false);

  useEffect(() => {
    let blinkTimeout;
    const startBlinkCycle = () => {
      const interval = Math.random() * 4000 + 3000;
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 200);
        startBlinkCycle();
      }, interval);
    };
    const initialDelay = setTimeout(startBlinkCycle, 1000);
    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(initialDelay);
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
    const { name, email, password, confirmPassword, address, photoURL } = data;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL || "https://i.ibb.co/default-profile.png",
      });

      await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          photoURL: photoURL || "https://i.ibb.co/default-profile.png",
          address,
          role: "user",
          status: "active",
        }),
      });

      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-5">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Create Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl border"
              {...register("name", { required: "Name is required" })}
              onFocus={lookAt}
              onBlur={resetLook}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

            <input
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-xl border"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              onFocus={lookAt}
              onBlur={resetLook}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <input
              placeholder="Profile Image URL"
              className="w-full px-4 py-3 rounded-xl border"
              {...register("photoURL")}
              onFocus={lookAt}
              onBlur={resetLook}
            />

            <input
              placeholder="Address"
              className="w-full px-4 py-3 rounded-xl border"
              {...register("address", { required: "Address is required" })}
              onFocus={lookAt}
              onBlur={resetLook}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              onFocus={lookAt}
              onBlur={resetLook}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-xl border"
              {...register("confirmPassword", { required: "Confirm password required" })}
              onFocus={lookAt}
              onBlur={resetLook}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}

            <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold">
              Register
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Login
            </Link>
          </p>
        </div>
      </motion.div>

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
              transition={{ duration: 0.15 }}
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

export default RegisterPage;
