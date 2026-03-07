const { getGeminiModel } = require('./aiService');

/**
 * Generates a single productivity tip for the user's current tasks.
 * @param {Array} tasks - Array of simplified task objects
 * @returns {Promise<string>} A single productivity tip sentence
 */
async function generateProductivityTip(tasks) {
    const model = getGeminiModel('gemini-3-flash-preview');

    if (!model) {
        return 'Make sure to break large tasks into smaller subtasks for better focus.';
    }

    if (!tasks || tasks.length === 0) {
        return 'Start by creating your first task and setting a clear deadline to stay on track!';
    }

    const highPriority = tasks.filter((t) => t.priority === 'high').length;
    const overdue = tasks.filter(
        (t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done'
    ).length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const total = tasks.length;

    const taskSummaryStr = tasks
        .map((t) => `- "${t.title}" [${t.priority}] [${t.status}]${t.deadline ? ` due ${t.deadline}` : ''}`)
        .join('\n');

    const prompt = [
        'You are a productivity coach AI. Analyze these tasks and give ONE short, specific, actionable productivity tip.',
        'Keep it to 1-2 sentences. Be direct and practical.',
        '',
        `Stats: ${total} total tasks, ${done} done, ${highPriority} high priority, ${overdue} overdue.`,
        '',
        'Tasks:',
        taskSummaryStr,
        '',
        'Return ONLY the tip text. No labels, no JSON, no markdown formatting.',
    ].join('\n');

    try {
        const result = await model.generateContent(prompt);
        const text = result?.response?.text?.() ?? '';
        return text.trim() || 'Focus on your highest priority task first to build momentum!';
    } catch {
        return 'Try time-blocking: assign specific hours to your highest priority tasks today.';
    }
}

module.exports = { generateProductivityTip };
