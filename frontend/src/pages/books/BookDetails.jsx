import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowMessage, setBorrowMessage] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load book details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleBorrowRequest = async () => {
    try {
      setBorrowing(true);
      setBorrowMessage(null);
      await api.post("/borrows/request", { bookId: book._id });
      setBorrowMessage({ type: "success", text: "Successfully requested to borrow!" });
    } catch (err) {
      setBorrowMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to submit request." 
      });
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">
          <p className="text-xl font-bold mb-2">Oops!</p>
          <p>{error || "Book not found."}</p>
          <Link to="/books" className="inline-block mt-4 text-blue-600 hover:underline">
            &larr; Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/books" className="text-blue-600 hover:text-blue-800 mb-6 flex items-center font-medium">
        &larr; Back to all books
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Left Side - Image */}
          <div className="w-full md:w-1/3 bg-gray-50 p-6 flex justify-center items-start border-b md:border-b-0 md:border-r border-gray-100">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full max-w-sm rounded-lg shadow-md object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 shadow-inner">
                No Cover Image
              </div>
            )}
          </div>

          {/* Right Side - Details */}
          <div className="w-full md:w-2/3 p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600">by <span className="font-semibold text-gray-800">{book.author}</span></p>
              </div>
              
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                    book.availableCopies > 0 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                  }`}>
                  {book.availableCopies > 0 ? "Available" : "Checked Out"}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {book.genre}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {book.category}
              </span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {book.type === "both" ? "Physical & Ebook" : book.type}
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center sm:flex-row sm:justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="font-semibold text-gray-900">Want to read this book?</p>
                <p className="text-sm text-gray-600">Physical copies must be requested and picked up.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  onClick={handleBorrowRequest}
                  disabled={borrowing || book.availableCopies < 1 || book.type === "ebook"}
                  className={`px-8 py-3 rounded-lg font-bold transition-all ${
                    book.availableCopies < 1 || book.type === "ebook"
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  {borrowing ? "Requesting..." : 
                   book.type === "ebook" ? "E-Book Only" :
                   book.availableCopies < 1 ? "Out of Stock" : 
                   "Request to Borrow"}
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {borrowMessage && (
              <div className={`mb-8 p-4 rounded-lg text-center font-medium ${
                borrowMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {borrowMessage.text}
              </div>
            )}

            {/* Grid for meta info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">ISBN</p>
                <p className="font-medium text-gray-900">{book.isbn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Department</p>
                <p className="font-medium text-gray-900">{book.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Language</p>
                <p className="font-medium text-gray-900">{book.language}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Quantity</p>
                <p className="font-medium text-gray-900">{book.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Available Copies</p>
                <p className="font-medium text-gray-900">{book.availableCopies}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
