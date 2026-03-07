const { getGeminiModel, safeParseJsonFromText } = require('./aiService');

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

function normalizeEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const task = entry.task != null ? String(entry.task).trim() : '';
  const time = entry.time != null ? String(entry.time).trim() : '';
  if (!task || !time) return null;
  return { task, time };
}

async function generateDailySchedule(tasks) {
  const model = getGeminiModel('gemini-3-flash-preview');
  if (!model) return { schedule: [], raw: { error: 'Missing GEMINI_API_KEY' } };

  const prompt = [
    'You are an expert productivity assistant.',
    'Given a list of user tasks, generate an optimized daily schedule for today.',
    'Use realistic times in 30–60 minute blocks. Include breaks when needed.',
    'Return ONLY valid JSON as an array of objects with exactly these keys:',
    '- task: string (task title)',
    '- time: string (e.g. "9:00 AM")',
    '',
    `User tasks: ${JSON.stringify(tasks)}`,
  ].join('\n');

  const result = await model.generateContent(prompt);
  const text = result?.response?.text?.() ?? '';

  const parsedArr = safeParseJsonArrayFromText(text);
  const parsedObj = parsedArr ? null : safeParseJsonFromText(text);
  const candidate = Array.isArray(parsedArr) ? parsedArr : Array.isArray(parsedObj) ? parsedObj : null;

  const schedule = (candidate || []).map(normalizeEntry).filter(Boolean);
  return { schedule, raw: { modelText: text } };
}

module.exports = { generateDailySchedule };

