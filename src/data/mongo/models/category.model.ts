import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  availabe: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId, // reference to the User model (which has a field _id)
    ref: "User",
    required: true,
  },
});

export const CategoryModel = mongoose.model("Category", categorySchema);
