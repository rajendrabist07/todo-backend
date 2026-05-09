import Task from "../models/task.js";

async function createTask(req, res) {
    try {
        const { taskname, description } = req.body;
        const { user } = req;
        const newTask = await Task.create({ taskname, description, user_id: user._id })

        res.status(201).json({ message: "task added successfully", data: newTask })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
}

async function getTasks(req, res) {
    try {
        const { user } = req;
        const tasks = await Task.find({ user_id: user._id });
        res.status(200).json({ message: 'tasks fetched successfully', data: tasks })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
}

async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const { taskname, description, completed } = req.body;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, user_id: req.user._id },
            { taskname, description, completed },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or not owned by user' });
        }

        res.status(200).json({ message: 'task updated successfully', data: updatedTask })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
}

async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findOneAndDelete({ _id: id, user_id: req.user._id });

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found or not owned by user' });
        }

        res.status(200).json({ message: 'task deleted successfully', data: deletedTask })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error })
    }
}

export { createTask, getTasks, updateTask, deleteTask }