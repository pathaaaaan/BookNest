import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please add an author"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Please add a genre"],
    },
    isbn: {
      type: String,
      required: [true, "Please add an ISBN"],
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    quantity: {
      type: Number,
      required: [true, "Please add total quantity"],
      min: 0,
    },
    availableCopies: {
      type: Number,
      required: [true, "Please add available copies"],
      min: 0,
    },
    type: {
      type: String,
      enum: ["physical", "ebook", "both"],
      default: "physical",
    },
    department: {
      type: String,
      required: [true, "Please add a department"],
    },
    language: {
      type: String,
      required: [true, "Please add a language"],
      default: "English",
    },
    coverImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent availableCopies from exceeding total quantity
bookSchema.pre("save", async function () {
  if (this.availableCopies > this.quantity) {
    this.availableCopies = this.quantity;
  }
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
