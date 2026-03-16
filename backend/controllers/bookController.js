import Book from "../models/Book.js";
import { cloudinary } from "../utils/cloudinary.js";

// Helper function to upload and delete from Cloudinary using streams
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "booknest/covers" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(buffer);
  });
};

const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split("/");
    const filename = urlParts[urlParts.length - 1];
    const publicId = `booknest/covers/${filename.split(".")[0]}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
  }
};

// @desc    Get all books (with search & filtering)
// @route   GET /api/books
// @access  Public/Students & Faculty
export const getBooks = async (req, res) => {
  try {
    const { search, genre, category, type, limit } = req.query;

    const query = {};

    // Search functionality (title or author)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    // Filtering
    if (genre) query.genre = genre;
    if (category) query.category = category;
    if (type) query.type = type;

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0);
      
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public/Students & Faculty
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book details", error: error.message });
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private/Faculty
export const addBook = async (req, res) => {
  try {
    let coverImageUrl = "";

    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      coverImageUrl = result.secure_url;
    }

    const {
      title,
      author,
      genre,
      isbn,
      category,
      description,
      quantity,
      availableCopies,
      type,
      department,
      language,
    } = req.body;

    const book = await Book.create({
      title,
      author,
      genre,
      isbn,
      category,
      description,
      quantity: Number(quantity),
      availableCopies: availableCopies ? Number(availableCopies) : Number(quantity),
      type,
      department,
      language,
      coverImage: coverImageUrl,
    });

    res.status(201).json(book);
  } catch (error) {
    // If it's a unique constraint error (ISBN usually)
    if (error.code === 11000) {
      return res.status(400).json({ message: "A book with this ISBN already exists" });
    }
    res.status(400).json({ message: "Failed to add book", error: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Faculty
export const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    let coverImageUrl = book.coverImage;

    // If new image was uploaded
    if (req.file) {
      // Delete old image
      await deleteFromCloudinary(book.coverImage);
      // Upload new one
      const result = await streamUpload(req.file.buffer);
      coverImageUrl = result.secure_url;
    }

    const updateData = { ...req.body, coverImage: coverImageUrl };

    // Format numbers if provided
    if (req.body.quantity) updateData.quantity = Number(req.body.quantity);
    if (req.body.availableCopies) updateData.availableCopies = Number(req.body.availableCopies);

    book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(book);
  } catch (error) {
    // If it's a unique constraint error (ISBN usually)
    if (error.code === 11000) {
      return res.status(400).json({ message: "A book with this ISBN already exists" });
    }
    res.status(400).json({ message: "Failed to update book", error: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Faculty
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete image from cloudinary
    await deleteFromCloudinary(book.coverImage);

    await book.deleteOne();

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error: error.message });
  }
};
