import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import BrowseBooks from "./pages/books/BrowseBooks.jsx";
import BookDetails from "./pages/books/BookDetails";
import MyBorrowedBooks from "./pages/borrows/MyBorrowedBooks";
import BorrowHistory from "./pages/borrows/BorrowHistory";

// Faculty Pages
import ManageBooks from "./pages/faculty/ManageBooks";
import BookForm from "./pages/faculty/BookForm";
import BorrowRequests from "./pages/faculty/BorrowRequests";
import IssuedBooks from "./pages/faculty/IssuedBooks";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Book Browsing Routes (Accessible by both roles) */}
          <Route path="/books" element={
            <ProtectedRoute allowedRoles={["student", "faculty"]}>
              <BrowseBooks />
            </ProtectedRoute>
          } />
          <Route path="/books/:id" element={
            <ProtectedRoute allowedRoles={["student", "faculty"]}>
              <BookDetails />
            </ProtectedRoute>
          } />

          {/* Student Specific Routes */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/borrows/my-books" element={<MyBorrowedBooks />} />
            <Route path="/borrows/history" element={<BorrowHistory />} />
          </Route>

          {/* Faculty Specific Routes */}
          <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/books" element={<ManageBooks />} />
            <Route path="/faculty/books/add" element={<BookForm />} />
            <Route path="/faculty/books/edit/:id" element={<BookForm />} />
            <Route path="/faculty/borrows/requests" element={<BorrowRequests />} />
            <Route path="/faculty/borrows/issued" element={<IssuedBooks />} />
          </Route>

        </Routes>
      </main>
    </div>
  );
}

export default App;
