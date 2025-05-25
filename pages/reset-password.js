import { BASE_URL } from "@/utils/api_constants";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function ResetPassword() {
  const [form, setForm] = useState({
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const { token } = router.query;

  const validate = () => {
    const newErrors = {};
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      if (!token) {
        setErrors({ api: "Invalid or missing token" });
        setLoading(false);
        return;
      }
      const payload = {
        new_password: form.password,
        token: token,
      };
      const res = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ api: data.detail || "Registration failed" });
      } else {
        setSuccess("Password updated successfully");
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
      console.log("Error during registration:", err);
      setErrors({ api: err.message || "An error occurred" });
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-10"
      style={{
        backgroundImage: "url(/bg-hero.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-md w-full bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg">
        <h3 className="mb-6 text-3xl font-bold text-center">
          Reset Your Password
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border border-red-500" : ""
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          {errors.api && (
            <div className="mb-4 text-red-400 text-center">{errors.api}</div>
          )}
          {success && (
            <div className="mb-4 text-green-400 text-center">{success}</div>
          )}
          <div className="flex justify-center mb-4">
            <button
              type="submit"
              className="w-full bg-[#9135e2] text-white text-lg py-2 px-6 rounded-lg font-semibold cursor-pointer transition-colors"
              disabled={loading}
            >
              {loading ? "updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
