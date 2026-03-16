import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Search State
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      // Construct query string
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (genre) params.append("genre", genre);
      if (category) params.append("category", category);
      if (type) params.append("type", type);

      const response = await api.get(`/books?${params.toString()}`);
      setBooks(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [genre, category, type]); // Refetch when filters change

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(); // Refetch when search is submitted
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Browse Library</h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
          />
        </form>

        <div className="flex gap-4">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
            <option value="History">History</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Journal">Journal</option>
            <option value="Magazine">Magazine</option>
            <option value="Novel">Novel</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="">All Types</option>
            <option value="physical">Physical Books</option>
            <option value="ebook">E-Books</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
          <button
            onClick={() => {
              setSearch("");
              setGenre("");
              setCategory("");
              setType("");
              fetchBooks();
            }}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <Link
              key={book._id}
              to={`/books/${book._id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden bg-gray-100 relative">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Cover
                  </div>
                )}
                {/* Type Badge */}
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {book.type === "both" ? "Physical & Ebook" : book.type.charAt(0).toUpperCase() + book.type.slice(1)}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                
                <div className="flex gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {book.genre}
                  </span>
                </div>

                {/* Spacer to push availability to bottom */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className={`text-sm font-semibold ${
                    book.availableCopies > 0 ? "text-green-600" : "text-red-500"
                  }`}>
                    {book.availableCopies > 0 
                      ? `${book.availableCopies} Copies Available` 
                      : "Out of Stock"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseBooks;
