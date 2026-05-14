import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, { timestamps: true });

// Index for efficient queries
taskSchema.index({ user_id: 1, createdAt: -1 });

export default mongoose.model("Task", taskSchema);