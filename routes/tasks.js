const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks (default route)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('createdBy', 'username firstName lastName')
      .populate('assignedTo', 'username firstName lastName')
      .populate('completedBy.userId', 'username firstName lastName');
    
    res.json({
      message: 'All tasks retrieved successfully',
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      createdBy: req.userId,
      assignedTo: assignedTo || [req.userId],
    });

    await task.save();
    await task.populate(['createdBy', 'assignedTo']);

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tasks (Level 1 - getAllTasks)
router.get('/all', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('createdBy', 'username firstName lastName')
      .populate('assignedTo', 'username firstName lastName')
      .populate('completedBy.userId', 'username firstName lastName');
    
    res.json({
      message: 'All tasks retrieved successfully',
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks by username (Level 1)
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tasks = await Task.find({
      $or: [
        { createdBy: user._id },
        { assignedTo: user._id }
      ]
    })
      .populate('createdBy', 'username firstName lastName')
      .populate('assignedTo', 'username firstName lastName')
      .populate('completedBy.userId', 'username firstName lastName');

    res.json({
      message: `Tasks for user: ${req.params.username}`,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks from today (Level 1)
router.get('/today/all', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate('createdBy', 'username firstName lastName')
      .populate('assignedTo', 'username firstName lastName')
      .populate('completedBy.userId', 'username firstName lastName');

    res.json({
      message: 'Tasks from today',
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get incomplete tasks (Level 1)
router.get('/incomplete/all', async (req, res) => {
  try {
    const tasks = await Task.find({
      isCompleted: false,
      status: { $ne: 'completed' },
    })
      .populate('createdBy', 'username firstName lastName')
      .populate('assignedTo', 'username firstName lastName')
      .populate('completedBy.userId', 'username firstName lastName');

    res.json({
      message: 'Incomplete tasks',
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks with users whose last name is 'Nguyễn' (Level 1)
router.get('/author/nguyen', async (req, res) => {
  try {
    const users = await User.find({
      lastName: { $regex: 'nguyễn', $options: 'i' },
    });

    const userIds = users.map(u => u._id);

    const tasks = await Task.find({
      $or: [
        { createdBy: { $in: userIds } },
        { assignedTo: { $in: userIds } },
      ],
    })
      .populate('createdBy', 'username firstName lastName')
      .populate('assignedTo', 'username firstName lastName')
      .populate('completedBy.userId', 'username firstName lastName');

    res.json({
      message: 'Tasks with users whose last name is Nguyễn',
      count: tasks.length,
      users: users.map(u => ({ id: u._id, name: `${u.firstName} ${u.lastName}` })),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task status
router.put('/:taskId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true }
    ).populate(['createdBy', 'assignedTo']);

    res.json({
      message: 'Task status updated',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complete task (Level 3 - for assigned users)
router.put('/:taskId/complete', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to this task
    const isAssigned = task.assignedTo.some(id => id.toString() === req.userId);
    if (!isAssigned) {
      return res.status(403).json({ message: 'You are not assigned to this task' });
    }

    // Check if user already completed this task
    const alreadyCompleted = task.completedBy.some(
      cb => cb.userId.toString() === req.userId
    );
    if (alreadyCompleted) {
      return res.status(400).json({ message: 'You have already completed this task' });
    }

    // Add user to completedBy array
    task.completedBy.push({
      userId: req.userId,
      completedAt: new Date(),
    });

    // Check if all assigned users have completed the task
    if (task.completedBy.length === task.assignedTo.length) {
      task.isCompleted = true;
      task.status = 'completed';
      task.completedAt = new Date();
    }

    await task.save();
    await task.populate(['createdBy', 'assignedTo', 'completedBy.userId']);

    res.json({
      message: 'Task marked as completed',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign task to user (Level 3)
router.put('/:taskId/assign', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if current user is admin or creator
    const currentUser = await User.findById(req.userId);
    if (currentUser.role !== 'admin' && task.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add user to assignedTo if not already assigned
    if (!task.assignedTo.includes(userId)) {
      task.assignedTo.push(userId);
      await task.save();
    }

    await task.populate(['createdBy', 'assignedTo']);

    res.json({
      message: 'Task assigned successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove assignment from task (Level 3)
router.put('/:taskId/unassign', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if current user is admin or creator
    const currentUser = await User.findById(req.userId);
    if (currentUser.role !== 'admin' && task.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Remove user from assignedTo
    task.assignedTo = task.assignedTo.filter(id => id.toString() !== userId);
    
    // Also remove from completedBy if user only needed to complete all tasks
    task.completedBy = task.completedBy.filter(
      cb => cb.userId.toString() !== userId
    );

    await task.save();
    await task.populate(['createdBy', 'assignedTo']);

    res.json({
      message: 'Task assignment removed',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task
router.delete('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is creator or admin
    const currentUser = await User.findById(req.userId);
    if (currentUser.role !== 'admin' && task.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
