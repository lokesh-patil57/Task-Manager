const express = require('express');

const { authMiddleware } = require('../middleware/authMiddleware');
const { getSchedule, breakdown } = require('../controllers/aiController');
const { generateProductivityTip } = require('../services/productivityTip');

const router = express.Router();

router.use(authMiddleware);

router.get('/schedule', getSchedule);
router.post('/breakdown', breakdown);

router.post('/productivity-tip', async (req, res) => {
    try {
        const { tasks = [] } = req.body;
        const tip = await generateProductivityTip(tasks);
        return res.json({ tip });
    } catch (err) {
        console.error('[productivity-tip]', err);
        return res.status(500).json({ message: 'Failed to generate tip' });
    }
});

module.exports = router;

