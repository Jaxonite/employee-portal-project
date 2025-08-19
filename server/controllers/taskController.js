const Task = require('../models/taskModel');

// @desc    Get tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasksForUser = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, dueDate, userId } = req.body;
  const task = new Task({
    title,
    description,
    dueDate,
    user: userId,
  });
  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

// @desc    Update a task to completed
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    if (task.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    task.isCompleted = req.body.isCompleted ?? task.isCompleted;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

module.exports = { getTasksForUser, createTask, updateTask };