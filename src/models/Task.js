import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
    },
    done: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// computed field to check if a task is overdue
taskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate) return false;
  return !this.done && this.dueDate < new Date();
});

export const Task = mongoose.model("Task", taskSchema);
