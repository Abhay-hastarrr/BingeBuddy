import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <form
        onSubmit={handleSignup}
        className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 pr-12 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-red-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 transition-colors py-2 rounded font-semibold"
        >
          Signup
        </button>

        {/* Already have an account link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-red-400 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
