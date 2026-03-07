const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');
const { getTasks, createTask, updateTask, deleteTask, analyzeTask, analyzeTaskRisk } = require('../controllers/taskController');
const { createTaskValidator, updateTaskValidator } = require('../validators/taskValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTaskValidator, createTask);
router.post('/analyze', analyzeTask);
router.post('/analyze-risk', analyzeTaskRisk);
router.put('/:id', updateTaskValidator, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;

