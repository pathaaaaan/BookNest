import express from "express";
import {
  requestBorrow,
  getMyBorrowedBooks,
  getMyBorrowHistory,
  getPendingRequests,
  getIssuedBooks,
  approveRequest,
  rejectRequest,
  markReturned,
} from "../controllers/borrowController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// STUDENT ROUTES
// ==========================================
router.post("/request", protect, authorizeRoles("student"), requestBorrow);
router.get("/my-books", protect, authorizeRoles("student"), getMyBorrowedBooks);
router.get("/my-history", protect, authorizeRoles("student"), getMyBorrowHistory);


// ==========================================
// FACULTY ROUTES
// ==========================================
router.get("/requests", protect, authorizeRoles("faculty"), getPendingRequests);
router.get("/issued", protect, authorizeRoles("faculty"), getIssuedBooks);
router.put("/:id/approve", protect, authorizeRoles("faculty"), approveRequest);
router.put("/:id/reject", protect, authorizeRoles("faculty"), rejectRequest);
router.put("/:id/return", protect, authorizeRoles("faculty"), markReturned);

export default router;
