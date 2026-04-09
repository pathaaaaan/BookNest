# BookNest

A sophisticated full-stack book management platform designed for readers to discover, organize, and track their reading journey. BookNest combines a powerful backend API with an intuitive React frontend to provide a seamless book discovery and library management experience.

## Features

- **User Authentication** – Secure registration and login with JWT-based authentication and password hashing
- **Book Discovery** – Browse and search an extensive book catalog powered by the Open Library API with fuzzy search capabilities
- **Personal Library** – Create and manage a personalized book collection with save/bookmark functionality
- **Reading Progress Tracking** – Track reading progress with detailed progress indicators and session history
- **Smart Recommendations** – Get personalized book recommendations based on reading preferences and history
- **User Reviews & Ratings** – Write and read reviews, rate books, and share your reading experience with the community
- **Book Details** – Access comprehensive book information including metadata, cover images, and descriptions
- **Dark/Light Theme** – Seamless theme switching with persistent user preference settings
- **Responsive Design** – Fully responsive interface optimized for desktop and mobile devices

## Tech Stack

### Frontend

- **React 19** – Modern UI library with hooks and functional components
- **Vite** – Lightning-fast build tool and development server
- **TailwindCSS** – Utility-first CSS framework for responsive styling
- **React Router** – Client-side routing for multi-page navigation
- **Axios** – HTTP client for API communication
- **Fuse.js** – Lightweight fuzzy search for book discovery

### Backend

- **Node.js & Express** – Lightweight and scalable server framework
- **MongoDB & Mongoose** – NoSQL database with schema validation
- **JWT** – Stateless authentication tokens
- **bcryptjs** – Secure password hashing
- **Multer** – Multipart form data handling for file uploads
- **Cloudinary** – Cloud-based image storage and optimization
- **Express Rate Limiter** – API rate limiting for security and stability

### Integration

- **Open Library API** – Real book data and metadata

## Installation

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn package manager
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/hasnainpathan/BookNest.git
   cd BookNest
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the server directory:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   Start the backend:

   ```bash
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd client
   npm install
   ```

   Create a `.env` file in the client directory:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

   Start the development server:

   ```bash
   npm run dev
   ```

4. **Access the Application**
   ```
   http://localhost:5173
   ```

## Usage

### Authentication

1. Create a new account or log in with existing credentials
2. JWT token is automatically stored and sent with API requests

### Discovering Books

- Use the search functionality with fuzzy matching to find books quickly
- Browse book details including descriptions, ratings, and reviews
- Add books to your personal library for tracking

### Managing Your Library

- Save books to your library
- Track reading progress for ongoing books
- View your complete reading history
- Get personalized recommendations based on your library

### Reviews & Ratings

- Write detailed reviews for books you've read
- Rate books on a 5-star scale
- View community reviews and ratings

### Reading Progress

- Start tracking a book and update progress regularly
- Log reading sessions with timestamps
- Get insights into your reading habits

## Project Structure

```
BookNest/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── books/        # Book-related components
│   │   │   ├── dashboard/    # Dashboard pages
│   │   │   ├── layout/       # Layout components
│   │   │   ├── reviews/      # Review components
│   │   │   └── ui/           # Generic UI components
│   │   ├── pages/            # Route pages
│   │   ├── api/              # API clients and axios config
│   │   ├── context/          # React context (Auth, Theme)
│   │   ├── assets/           # Static assets
│   │   └── main.jsx          # Entry point
│   └── package.json
│
├── server/                    # Express backend
│   ├── controllers/          # Request handlers
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware (auth, error handling)
│   ├── services/             # Business logic (recommendations, external APIs)
│   ├── config/               # Database and environment config
│   ├── utils/                # Helper functions
│   ├── server.js             # Entry point
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` – Create new user account
- `POST /api/auth/login` – Authenticate user

### Books

- `GET /api/books` – Fetch all books
- `GET /api/books/:id` – Get book details
- `GET /api/books/search?q=query` – Search books

### Library

- `GET /api/library` – Get user's library
- `POST /api/library/:bookId` – Add book to library
- `DELETE /api/library/:bookId` – Remove book from library

### Reading Progress

- `GET /api/reading` – Get reading sessions
- `POST /api/reading` – Create reading session
- `PUT /api/reading/:id` – Update reading progress

### Reviews

- `GET /api/reviews/:bookId` – Get book reviews
- `POST /api/reviews/:bookId` – Create review
- `PUT /api/reviews/:id` – Update review
- `DELETE /api/reviews/:id` – Delete review

### Recommendations

- `GET /api/recommendations` – Get personalized recommendations

## Development

### Build for Production

```bash
# Frontend
cd client
npm run build

# Backend - already optimized
cd server
npm start
```

### Code Quality

```bash
# Frontend linting
cd client
npm run lint
```

## Future Enhancements

- Social features (follow readers, see friend activity)
- Reading lists and curated collections
- Reading challenges and gamification
- Real-time notifications
- Advanced analytics and reading insights
- Integration with Goodreads API
- Export reading history
- Offline reading support
- Advanced book filtering and sorting

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the ISC License – see the LICENSE file for details.

## Acknowledgments

- Open Library API for comprehensive book data
- React and Node.js communities
- All contributors who help improve BookNest

---

**Built with ❤️ for book lovers everywhere**

For questions or feedback, please open an issue or contact the project maintainers.
