const { body } = require('express-validator');

const statusEnum = ['pending', 'in-progress', 'done'];
const priorityEnum = ['low', 'medium', 'high'];

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('title is required')
    .bail()
    .isLength({ min: 3 })
    .withMessage('title must be at least 3 characters'),
  body('status').optional().isIn(statusEnum).withMessage('invalid status'),
  body('priority').optional().isIn(priorityEnum).withMessage('invalid priority'),
  body('deadline').optional({ nullable: true }).isISO8601().withMessage('invalid deadline'),
  body('estimatedTime').optional({ nullable: true }).isNumeric().withMessage('invalid estimatedTime'),
  body('description').optional().isString().withMessage('invalid description'),
];

const updateTaskValidator = [
  body('title').optional().trim().isLength({ min: 3 }).withMessage('title must be at least 3 characters'),
  body('status').optional().isIn(statusEnum).withMessage('invalid status'),
  body('priority').optional().isIn(priorityEnum).withMessage('invalid priority'),
  body('deadline').optional({ nullable: true }).isISO8601().withMessage('invalid deadline'),
  body('estimatedTime').optional({ nullable: true }).isNumeric().withMessage('invalid estimatedTime'),
  body('description').optional().isString().withMessage('invalid description'),
];

module.exports = { createTaskValidator, updateTaskValidator, statusEnum, priorityEnum };
