const { validationResult } = require('express-validator');

const Task = require('../models/Task');
const { analyzeTaskTitle } = require('../services/aiService');
const { analyzeDeadlineRisk } = require('../services/riskAnalyzer');

function validationErrorResponse(res, errors) {
  console.log('--- VALIDATION ERROR ---', errors.array());
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
  });
}

async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, tasks });
  } catch (err) {
    return next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return validationErrorResponse(res, errors);

    const { title, description, status, priority, deadline, estimatedTime } = req.body;

    const task = await Task.create({
      user: req.user.id,
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      riskLevel: 'low',
      deadline: deadline ? new Date(deadline) : null,
      estimatedTime: estimatedTime != null ? Number(estimatedTime) : null,
      ai: {
        priority: null,
        estimatedTime: null,
        suggestedDeadline: null,
        riskSuggestion: null,
        raw: null,
      },
    });

    console.log('--- TASK CREATED ---', task);
    return res.status(201).json({ success: true, task });
  } catch (err) {
    console.error('--- CREATE TASK ERROR ---', err);
    return next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return validationErrorResponse(res, errors);

    const { id } = req.params;
    const updates = {};

    const allowed = ['title', 'description', 'status', 'priority', 'deadline', 'estimatedTime', 'riskLevel', 'ai'];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'deadline')) {
      updates.deadline = updates.deadline ? new Date(updates.deadline) : null;
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'estimatedTime')) {
      updates.estimatedTime = updates.estimatedTime != null ? Number(updates.estimatedTime) : null;
    }

    const task = await Task.findOneAndUpdate({ _id: id, user: req.user.id }, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    console.log('--- TASK UPDATED ---', task);
    return res.json({ success: true, task });
  } catch (err) {
    console.error('--- UPDATE TASK ERROR ---', err);
    return next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    console.log('--- TASK DELETED ---', id);
    return res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    console.error('--- DELETE TASK ERROR ---', err);
    return next(err);
  }
}

// Dedicated AI Endpoints
async function analyzeTask(req, res, next) {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required for analysis' });

    const analysis = await analyzeTaskTitle(title);

    // Check if AI crashed/failed rate limits
    if (analysis.raw && analysis.raw.error) {
      return res.status(429).json({ success: false, message: 'Heavy load on AI. Try again later.' });
    }

    return res.json({ success: true, analysis });
  } catch (err) {
    return next(err);
  }
}

async function analyzeTaskRisk(req, res, next) {
  try {
    const { title, deadline, estimatedTime } = req.body;

    const risk = await analyzeDeadlineRisk({ title, deadline, estimatedTime });

    // Check if AI crashed/failed rate limits
    if (risk.raw && risk.raw.error) {
      return res.status(429).json({ success: false, message: 'Heavy load on AI. Try again later.' });
    }

    return res.json({ success: true, risk });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask, analyzeTask, analyzeTaskRisk };

