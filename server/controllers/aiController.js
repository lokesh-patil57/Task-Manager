const Task = require('../models/Task');
const { generateDailySchedule } = require('../services/aiScheduler');
const { getGeminiModel, safeParseJsonFromText } = require('../services/aiService');

function safeParseJsonArrayFromText(text) {
  if (!text) return null;
  const trimmed = String(text).trim();

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : null;
  } catch {}

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1]) {
    try {
      const parsed = JSON.parse(fenceMatch[1]);
      return Array.isArray(parsed) ? parsed : null;
    } catch {}
  }

  const firstBracket = trimmed.indexOf('[');
  const lastBracket = trimmed.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const candidate = trimmed.slice(firstBracket, lastBracket + 1);
    try {
      const parsed = JSON.parse(candidate);
      return Array.isArray(parsed) ? parsed : null;
    } catch {}
  }

  return null;
}

async function getSchedule(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    const simplified = tasks.map((t) => ({
      title: t.title,
      priority: t.priority,
      status: t.status,
      deadline: t.deadline ? t.deadline.toISOString() : null,
      estimatedTime: t.estimatedTime,
    }));

    const { schedule } = await generateDailySchedule(simplified);
    return res.json({ success: true, schedule });
  } catch (err) {
    return next(err);
  }
}

async function breakdown(req, res, next) {
  try {
    const title = req.body?.title;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'title is required' });
    }

    const model = getGeminiModel('gemini-3-flash-preview');
    if (!model) {
      return res.json({ success: true, subtasks: [], warning: 'Missing GEMINI_API_KEY' });
    }

    const prompt = [
      'Break this task into smaller actionable subtasks.',
      'Return ONLY valid JSON as an array of strings.',
      'Each string should be concise and start with a verb.',
      '',
      `Task title: ${JSON.stringify(String(title).trim())}`,
    ].join('\n');

    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() ?? '';

    const parsedArr = safeParseJsonArrayFromText(text);
    const parsedObj = parsedArr ? null : safeParseJsonFromText(text);
    const candidate = Array.isArray(parsedArr) ? parsedArr : Array.isArray(parsedObj) ? parsedObj : null;

    const subtasks = (candidate || [])
      .map((s) => (s == null ? '' : String(s).trim()))
      .filter(Boolean)
      .slice(0, 20);

    return res.json({ success: true, subtasks });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getSchedule, breakdown };

