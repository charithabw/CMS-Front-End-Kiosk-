import React from "react";
//import { useState } from "react";

/*
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = (e) => {
  e.preventDefault();
  // Add login logic here
  console.log("Login attempt", { email, password });
};
*/

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-12 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <div className="flex justify-center mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Bank_of_Ceylon.svg/330px-Bank_of_Ceylon.svg.png"
            alt="Bank of Ceylon"
            className="w-32"
          />
        </div>
        <h2 className="text-3xl font-bold text-yellow-500 text-center mb-6">
          Login to Your Account
        </h2>
        <form>
          <div className="mb-6">
            <label htmlFor="email" className="block text-white text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-yellow-700 transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-white text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-yellow-700 transition-all duration-300"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-white">
          <a href="#" className="text-yellow-500 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
