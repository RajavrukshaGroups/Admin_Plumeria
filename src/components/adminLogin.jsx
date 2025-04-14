import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Signin } from "../api/auth";
import { loginSuccess } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) return alert("Please fill in the email and password");
    try {
      const data = await Signin(email, password);
      if (data.success) {
        alert("Login Successful");
        // Save token and user to Redux
        dispatch(loginSuccess({ token: data.token, user: data.user }));
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network error. Please try again later.");
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
        <div className="logo">
          <img src={'https://plumeriaresort.in/assets/RRPL_Group_logo_New--pkdVAFV.png'} />
        </div>
        <h1 className="text-4xl font-semibold mb-4 text-center">Admin Login</h1>
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
          <button
            type="submit"
            className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;