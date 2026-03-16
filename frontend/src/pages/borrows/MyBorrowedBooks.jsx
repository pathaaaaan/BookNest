import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const MyBorrowedBooks = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const response = await api.get("/borrows/my-books");
        setRecords(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch borrowed books");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBooks();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDateStr) => {
    const today = new Date();
    const dueDate = new Date(dueDateStr);
    return today > dueDate;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Borrowed Books</h1>
        <Link
          to="/books"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Browse More
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center font-medium">
          {error}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="mb-4 text-gray-400">📚</div>
          <p className="text-gray-500 text-lg mb-4">You have no active borrow requests or issued books.</p>
          <Link to="/books" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Find a book to read!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <div key={record._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${
                  record.status === "approved" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {record.status === "approved" ? "Active" : "Pending"}
                </span>
                <span className="text-xs text-gray-500">
                  {record.status === "requested" 
                    ? `Requested: ${formatDate(record.requestDate)}` 
                    : `Issued: ${formatDate(record.issueDate)}`}
                </span>
              </div>
              
              <div className="p-5 flex gap-4">
                <div className="flex-shrink-0 w-20 h-28 bg-gray-200 rounded overflow-hidden shadow-sm">
                  {record.book.coverImage ? (
                    <img src={record.book.coverImage} alt={record.book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center p-2 text-center text-gray-400 text-xs">
                      No Cover
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/books/${record.book._id}`} className="block font-bold text-gray-900 truncate hover:text-indigo-600 transition-colors">
                    {record.book.title}
                  </Link>
                  <p className="text-sm text-gray-500 truncate mb-1">{record.book.author}</p>
                  
                  {record.status === "approved" && record.dueDate && (
                    <div className={`mt-3 p-2 rounded text-sm ${
                      isOverdue(record.dueDate) ? "bg-red-50 text-red-700 border border-red-100" : "bg-blue-50 text-blue-700"
                    }`}>
                      <span className="font-semibold block mb-0.5">Due Date:</span>
                      {formatDate(record.dueDate)}
                      {isOverdue(record.dueDate) && <span className="block text-xs mt-1 font-bold">OVERDUE</span>}
                    </div>
                  )}
                  
                  {record.status === "requested" && (
                    <p className="mt-3 text-sm italic text-gray-500">Waiting for faculty approval...</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBorrowedBooks;
