import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/borrows/requests");
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch borrow requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await api.put(`/borrows/${id}/approve`);
      // Remove from pending list
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      try {
        setActionLoading(id);
        await api.put(`/borrows/${id}/reject`, { remarks: "Rejected by faculty" });
        // Remove from pending list
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to reject request");
      } finally {
        setActionLoading(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pending Borrow Requests</h1>
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
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <span className="text-4xl">🎉</span>
          <p className="text-gray-500 text-lg mt-4">All caught up! No pending borrow requests.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{request.user.name}</div>
                      <div className="text-sm text-gray-500">{request.user.studentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-8 flex-shrink-0 bg-gray-200 rounded overflow-hidden mr-3">
                          {request.book.coverImage && (
                            <img src={request.book.coverImage} className="h-full w-full object-cover" alt="" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={request.book.title}>
                            {request.book.title}
                          </div>
                          <div className="text-xs text-gray-500">{request.book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.book.availableCopies > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {request.book.availableCopies} available
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleApprove(request._id)}
                        disabled={actionLoading === request._id || request.book.availableCopies < 1}
                        className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded border border-green-200 mr-2 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        disabled={actionLoading === request._id}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded border border-red-200 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowRequests;
