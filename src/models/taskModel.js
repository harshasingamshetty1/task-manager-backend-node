const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    // This is the relationship between the user and the task
    // Types.ObjectId is a special type of data that is used to store the id of another object
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// creating a model with the taskSchema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
