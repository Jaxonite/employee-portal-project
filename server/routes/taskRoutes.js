const express = require('express');
const router = express.Router();
const { getTasksForUser, createTask, updateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTasksForUser).post(protect, createTask);
router.route('/:id').put(protect, updateTask);

module.exports = router;