import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow p-6 border-t-4 border-indigo-600">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Faculty Dashboard</h1>
        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
          <p className="text-gray-600 text-lg">
            Welcome back, Prof. <span className="font-semibold">{user?.name}</span>!
          </p>
          <Link to="/books" className="px-5 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors">
            View Public Library
          </Link>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/faculty/books" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-300">
            <h3 className="text-lg font-bold text-indigo-700">Manage Books</h3>
            <p className="text-sm text-gray-500 mt-2">Add, edit, or remove books from the library</p>
          </Link>
          <Link to="/faculty/borrows/requests" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-300">
            <h3 className="text-lg font-bold text-gray-800">Borrow Requests</h3>
            <p className="text-sm text-gray-500 mt-2">Approve or reject physical book requests</p>
          </Link>
          <Link to="/faculty/borrows/issued" className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-300">
            <h3 className="text-lg font-bold text-gray-800">Issued Books</h3>
            <p className="text-sm text-gray-500 mt-2">Track active loans and mark books as returned</p>
          </Link>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-800">Manage Students</h3>
            <p className="text-sm text-gray-500 mt-2">View student records and fines</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-800">Reports</h3>
            <p className="text-sm text-gray-500 mt-2">View library usage analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
