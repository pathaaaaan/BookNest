import BorrowRecord from "../models/BorrowRecord.js";
import Book from "../models/Book.js";

// ==========================================
// STUDENT OPERATIONS
// ==========================================

// @desc    Request to borrow a book
// @route   POST /api/borrows/request
// @access  Private/Student
export const requestBorrow = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    // Check if book exists and is physical/both
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.type === "ebook") {
      return res.status(400).json({ message: "E-books cannot be physically borrowed." });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({ message: "No copies currently available." });
    }

    // Check if user already has an active request or approved borrow for this book
    const existingActiveRecord = await BorrowRecord.findOne({
      user: userId,
      book: bookId,
      status: { $in: ["requested", "approved"] },
    });

    if (existingActiveRecord) {
      return res.status(400).json({ message: "You already have an active request or borrow for this book." });
    }

    const borrowRecord = await BorrowRecord.create({
      user: userId,
      book: bookId,
      status: "requested",
    });

    res.status(201).json({ message: "Borrow request submitted successfully", record: borrowRecord });
  } catch (error) {
    res.status(500).json({ message: "Failed to request borrow", error: error.message });
  }
};

// @desc    Get logged-in user's active borrowed books ("approved")
// @route   GET /api/borrows/my-books
// @access  Private/Student
export const getMyBorrowedBooks = async (req, res) => {
  try {
    const records = await BorrowRecord.find({
      user: req.user._id,
      status: { $in: ["approved", "requested"] }, // Show pending requests and issued books
    })
      .populate("book", "title author coverImage type department isbn")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch borrowed books", error: error.message });
  }
};

// @desc    Get logged-in user's borrow history (all statuses)
// @route   GET /api/borrows/my-history
// @access  Private/Student
export const getMyBorrowHistory = async (req, res) => {
  try {
    const records = await BorrowRecord.find({ user: req.user._id })
      .populate("book", "title author coverImage")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history", error: error.message });
  }
};

// ==========================================
// FACULTY OPERATIONS
// ==========================================

// @desc    Get all pending borrow requests
// @route   GET /api/borrows/requests
// @access  Private/Faculty
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await BorrowRecord.find({ status: "requested" })
      .populate("user", "name email studentId department")
      .populate("book", "title author coverImage availableCopies quantity")
      .sort({ requestDate: 1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error: error.message });
  }
};

// @desc    Get all active issued books
// @route   GET /api/borrows/issued
// @access  Private/Faculty
export const getIssuedBooks = async (req, res) => {
  try {
    const issuedBooks = await BorrowRecord.find({ status: "approved" })
      .populate("user", "name email studentId")
      .populate("book", "title author coverImage isbn")
      .sort({ issueDate: -1 });

    res.status(200).json(issuedBooks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issued books", error: error.message });
  }
};

// @desc    Approve a borrow request
// @route   PUT /api/borrows/:id/approve
// @access  Private/Faculty
export const approveRequest = async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id);

    if (!record) return res.status(404).json({ message: "Record not found" });
    if (record.status !== "requested") return res.status(400).json({ message: "Only requested records can be approved" });

    const book = await Book.findById(record.book);
    
    // Final check before approval
    if (book.availableCopies < 1) {
      return res.status(400).json({ message: "Book is no longer available" });
    }

    // Set dates - standard 14 day borrow period
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    record.status = "approved";
    record.issueDate = issueDate;
    record.dueDate = dueDate;
    record.handledBy = req.user._id;

    // Deduct available copy
    book.availableCopies -= 1;
    
    await book.save();
    await record.save();

    res.status(200).json({ message: "Request approved successfully", record });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve request", error: error.message });
  }
};

// @desc    Reject a borrow request
// @route   PUT /api/borrows/:id/reject
// @access  Private/Faculty
export const rejectRequest = async (req, res) => {
  try {
    const { remarks } = req.body;
    const record = await BorrowRecord.findById(req.params.id);

    if (!record) return res.status(404).json({ message: "Record not found" });
    if (record.status !== "requested") return res.status(400).json({ message: "Only requested records can be rejected" });

    record.status = "rejected";
    record.handledBy = req.user._id;
    record.remarks = remarks || "Rejected by faculty";
    
    await record.save();

    res.status(200).json({ message: "Request rejected specifically", record });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject request", error: error.message });
  }
};

// @desc    Mark a book as returned
// @route   PUT /api/borrows/:id/return
// @access  Private/Faculty
export const markReturned = async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id);

    if (!record) return res.status(404).json({ message: "Record not found" });
    if (record.status !== "approved") return res.status(400).json({ message: "Only issued books can be marked as returned" });

    record.status = "returned";
    record.returnDate = new Date();
    record.handledBy = req.user._id;

    // Add copy back to library
    const book = await Book.findById(record.book);
    book.availableCopies += 1;
    
    await book.save();
    await record.save();

    res.status(200).json({ message: "Book marked as returned", record });
  } catch (error) {
    res.status(500).json({ message: "Failed to register return", error: error.message });
  }
};
