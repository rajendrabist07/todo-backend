import Task from "../models/task.js";
import mongoose from "mongoose";

async function createTask(req, res) {
    try {
        const { taskname, description } = req.body;
        const { user } = req;
        if (!taskname || typeof taskname !== "string" || !taskname.trim()) {
            return res.status(400).json({ message: "taskname is required" });
        }
        if (!description || typeof description !== "string" || !description.trim()) {
            return res.status(400).json({ message: "description is required" });
        }

        const newTask = await Task.create({ taskname, description, user_id: user._id })

        res.status(201).json({ message: "task added successfully", data: newTask })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

async function getTasks(req, res) {
    try {
        const { user } = req;
        const tasks = await Task.find({ user_id: user._id });
        res.status(200).json({ message: 'tasks fetched successfully', data: tasks })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

async function updateTask(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task id" });
        }

        const { taskname, description, completed } = req.body;

        const update = {};
        if (taskname !== undefined) {
            if (typeof taskname !== "string" || !taskname.trim()) {
                return res.status(400).json({ message: "taskname must be a non-empty string" });
            }
            update.taskname = taskname;
        }
        if (description !== undefined) {
            if (typeof description !== "string" || !description.trim()) {
                return res.status(400).json({ message: "description must be a non-empty string" });
            }
            update.description = description;
        }
        if (completed !== undefined) {
            if (typeof completed !== "boolean") {
                return res.status(400).json({ message: "completed must be a boolean" });
            }
            update.completed = completed;
        }
        if (Object.keys(update).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, user_id: req.user._id },
            update,
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or not owned by user' });
        }

        res.status(200).json({ message: 'task updated successfully', data: updatedTask })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task id" });
        }

        const deletedTask = await Task.findOneAndDelete({ _id: id, user_id: req.user._id });

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found or not owned by user' });
        }

        res.status(200).json({ message: 'task deleted successfully', data: deletedTask })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export { createTask, getTasks, updateTask, deleteTask }