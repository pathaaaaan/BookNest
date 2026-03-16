import { Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  // If user is already logged in, redirect them to their respective dashboard
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Welcome to <span className="text-indigo-600">BookNest</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
        Your modern, AI-ready college library management system. Access resources, 
        manage books, and streamline your academic journey.
      </p>
      <div className="space-x-4">
        <Link
          to="/signup"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-white hover:bg-gray-50 text-indigo-600 font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
