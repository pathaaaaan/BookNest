import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const IssuedBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchIssuedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/borrows/issued");
      setIssuedBooks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch issued books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const handleReturn = async (id) => {
    if (window.confirm("Confirm this book has been physically returned?")) {
      try {
        setActionLoading(id);
        await api.put(`/borrows/${id}/return`);
        // Remove from issued list (or mark returned)
        setIssuedBooks((prev) => prev.filter((rec) => rec._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to mark book as returned");
      } finally {
        setActionLoading(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
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
        <h1 className="text-3xl font-bold text-gray-900">Actively Issued Books</h1>
        <Link to="/faculty/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
          &larr; Back to Dashboard
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
      ) : issuedBooks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">There are currently no books issued to students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {issuedBooks.map((record) => (
            <div key={record._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              
              <div className={`p-3 border-b border-gray-100 flex justify-between items-center ${
                isOverdue(record.dueDate) ? "bg-red-50" : "bg-gray-50"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">{record.user.name}</span>
                  <span className="text-xs text-gray-500">({record.user.studentId})</span>
                </div>
                {isOverdue(record.dueDate) && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">OVERDUE</span>
                )}
              </div>
              
              <div className="p-4 flex gap-4 flex-grow">
                <div className="flex-shrink-0 w-16 h-24 bg-gray-200 rounded overflow-hidden">
                  {record.book.coverImage && (
                    <img src={record.book.coverImage} className="w-full h-full object-cover" alt="" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate" title={record.book.title}>
                    {record.book.title}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">ISBN: {record.book.isbn}</p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs">Issued</span>
                      <span className="font-medium">{formatDate(record.issueDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">Due</span>
                      <span className={`font-medium ${isOverdue(record.dueDate) ? "text-red-600" : ""}`}>
                        {formatDate(record.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-50 bg-gray-50">
                <button
                  onClick={() => handleReturn(record._id)}
                  disabled={actionLoading === record._id}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {actionLoading === record._id ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  ) : "Mark as Returned"}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssuedBooks;
