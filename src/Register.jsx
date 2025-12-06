import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase.init"; 
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { name, email, password, confirmPassword, address, photoURL } = data;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Firebase user create
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL || "https://i.ibb.co/default-profile.png",
      });

      // Optionally save user in MongoDB (role: user, status: active)
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
      navigate("/"); // বা login page
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          {/* Profile Image */}
          <div>
            <label className="block font-medium">Profile Image URL</label>
            <input
              type="text"
              placeholder="Image URL"
              className="input input-bordered w-full"
              {...register("photoURL")}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              placeholder="Your Address"
              className="input input-bordered w-full"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              {...register("password", { required: "Password is required", minLength: 6 })}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered w-full"
              {...register("confirmPassword", { required: "Confirm your password" })}
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
         <p className="text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
