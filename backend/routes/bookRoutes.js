import express from "express";
import { upload } from "../utils/cloudinary.js";
import {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Publicly readable (but require login)
router.get("/", protect, getBooks);
router.get("/:id", protect, getBookById);

// Faculty only routes for modification
router.post(
  "/",
  protect,
  authorizeRoles("faculty"),
  upload.single("coverImage"),
  addBook
);

router.put(
  "/:id",
  protect,
  authorizeRoles("faculty"),
  upload.single("coverImage"),
  updateBook
);

router.delete("/:id", protect, authorizeRoles("faculty"), deleteBook);

export default router;
