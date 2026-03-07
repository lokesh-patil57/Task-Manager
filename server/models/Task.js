const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending', index: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', index: true },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low', index: true },
    deadline: { type: Date, default: null },
    estimatedTime: { type: Number, default: null }, 
    ai: {
      priority: { type: String, enum: ['low', 'medium', 'high'], default: null },
      estimatedTime: { type: Number, default: null },
      suggestedDeadline: { type: Date, default: null },
      riskSuggestion: { type: String, default: null },
      raw: { type: mongoose.Schema.Types.Mixed, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
