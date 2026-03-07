const express = require('express');
const router = express.Router();
const { generateProductivityTip } = require('../services/productivityTip');
const { protect } = require('../middleware/auth');

// POST /api/ai/productivity-tip
router.post('/productivity-tip', protect, async (req, res) => {
    try {
        const { tasks = [] } = req.body;
        const tip = await generateProductivityTip(tasks);
        return res.json({ tip });
    } catch (err) {
        console.error('[AI productivity tip]', err);
        return res.status(500).json({ message: 'Failed to generate tip' });
    }
});

module.exports = router;
