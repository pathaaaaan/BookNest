# BookNest - College Library Management System

A modern, full-stack web application designed for college libraries to manage their catalog and track book loans. 
This project is built using the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## Features (Phase 1)

### 📚 Book Management
- Faculty can add, edit, and delete physical or electronic books.
- Automated cover image uploading using Cloudinary.
- Students can browse, search, and filter the public catalog by genre, category, or type.
- View detailed metadata and availability status for any book.

### 🔐 Authentication & Roles
- Secure JWT-based authentication with bcrypt password hashing.
- Role-based Access Control (RBAC):
  - **Student Role**: Can browse the library, request books, and view personal borrowing history.
  - **Faculty Role**: Has admin privileges to manage the library inventory and approve/reject borrow requests.

### 🔄 Borrowing System (Physical Books)
- **Students**: Request to borrow available physical books, track active loans, and monitor return due dates.
- **Faculty**: Review incoming borrow requests, approve/reject them, and track actively issued books. 
- Automated inventory management (available copies decrease on approval, increase on return).

## Tech Stack
- **Frontend**: React.js (Vite), React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **File Storage**: Cloudinary (for book covers)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (Local installation like Compass, or MongoDB Atlas URI)
- Cloudinary Account (Free tier is fine)

### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### 3. Usage & Testing

1. Open the frontend URL in your browser (usually `http://localhost:5173`).
2. Click **Sign Up** and toggle to **Faculty** to create an admin account.
3. Log in as the Faculty member and add a few books to the catalog via the "Manage Books" dashboard.
4. Log out, and **Sign Up** again as a **Student**.
5. Browse the catalog, click on a physical book, and "Request to Borrow".
6. Log back in as Faculty to approve the request and see the inventory update dynamically!

---

*Note: Features like E-book Reading, Fine Payments, and external APIs are scoped for future execution phases.*
