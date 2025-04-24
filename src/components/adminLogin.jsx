import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Signin } from "../api/auth";
import { loginSuccess } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { showSuccessToast,showErrorToast  } from "../../src/components/utils/toastHelper"; // Adjust path as needed


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      showErrorToast("Please fill in the email and password");
      return;
    }
  
    setLoading(true);
  
    try {
      const data = await Signin(email, password);
  
      if (data.success) {
        // Save token and user to Redux
        dispatch(loginSuccess({ token: data.token, user: data.user }));
  
        // Wait for 5 seconds before navigating
        setTimeout(() => {
          showSuccessToast("Login Successful");
          setLoading(false);
          navigate("/");
        }, 2000);
      } else {
        showErrorToast(data.message);
        setLoading(false);
      }
    } catch (error) {
      showErrorToast("Network error. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-sky-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826"
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <div className="flex justify-center mb-6">
      <img
        src="http://localhost:5174/src/assets/plumeriaresortimages/Logo_RRPL_New.png"
        alt="Company Logo"
        className="h-20"
      />
    </div>

        {/* <h1 className="text-4xl font-semibold mb-4 text-center">Admin Login</h1> */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
      Admin Panel Login
    </h1>
        <form onSubmit={handleSubmit} method="POST">
          <div className="mb-4 bg-sky-100">
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-800">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* <button
            type="submit"
            className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Login
          </button> */}
           <button
        type="submit"
        disabled={loading}
        className={`${
          loading ? 'bg-blue-600 cursor-not-allowed' : 'bg-red-500 hover:bg-blue-600'
        } text-white font-semibold rounded-md py-2 px-4 w-full flex items-center justify-center`}
      >
        {loading ? (
          <>
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mr-2 animate-spin"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M526 1394q0 53...z" />
            </svg>
            Loading...
          </>
        ) : (
          'Login'
        )}
      </button>
        </form>
      </div>
    </div>
  );
};

export default Login;