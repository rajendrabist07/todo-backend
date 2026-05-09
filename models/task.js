import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })


export default mongoose.model("Task", taskSchema)