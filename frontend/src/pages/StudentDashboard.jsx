import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Student Dashboard</h1>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600 text-lg">
            Welcome back, <span className="font-semibold">{user?.name}</span>!
          </p>
          <Link to="/books" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Browse Library Catalog
          </Link>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/borrows/my-books" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-300">
            <h3 className="text-lg font-bold text-gray-800">My Borrowed Books</h3>
            <p className="text-sm text-gray-500 mt-2">Track active loans and due dates</p>
          </Link>
          <Link to="/borrows/history" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-300">
            <h3 className="text-lg font-bold text-gray-800">Borrow History</h3>
            <p className="text-sm text-gray-500 mt-2">View your past reading history</p>
          </Link>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-2">Reservations</h3>
            <p className="text-blue-600">No active book reservations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
