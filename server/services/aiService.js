const { GoogleGenerativeAI } = require('@google/generative-ai');

function safeParseJsonFromText(text) {
  if (!text) return null;

  const trimmed = String(text).trim();

  try {
    return JSON.parse(trimmed);
  } catch { }

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1]) {
    try {
      return JSON.parse(fenceMatch[1]);
    } catch { }
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch { }
  }

  return null;
}

function getGeminiModel(modelName = 'gemini-3-flash-preview') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

function normalizePriority(p) {
  if (!p) return null;
  const v = String(p).toLowerCase().trim();
  if (['low', 'medium', 'high'].includes(v)) return v;
  return null;
}

function coerceHours(x) {
  if (x == null) return null;
  if (typeof x === 'number' && Number.isFinite(x)) return Math.max(0.25, x);
  const s = String(x).toLowerCase().trim();
  const n = Number(s.replace(/[^\d.]/g, ''));
  if (Number.isFinite(n) && n > 0) return n;
  return null;
}

function coerceDate(x) {
  if (!x) return null;
  if (x instanceof Date && !Number.isNaN(x.getTime())) return x;
  const d = new Date(x);
  if (!Number.isNaN(d.getTime())) return d;
  return null;
}

async function analyzeTaskTitle(title) {
  const model = getGeminiModel('gemini-3-flash-preview');
  if (!model) {
    return {
      priority: null,
      estimatedTime: null,
      suggestedDeadline: null,
      raw: { error: 'Missing GEMINI_API_KEY' },
    };
  }

  const prompt = [
    'You are an expert productivity assistant.',
    'Given a task title, estimate priority, estimatedTime, and suggestedDeadline.',
    'Return ONLY valid JSON with exactly these keys:',
    '- priority: one of "low" | "medium" | "high"',
    '- estimatedTime: number of hours (can be decimal)',
    '- suggestedDeadline: an ISO 8601 date-time string',
    '',
    `Task title: ${JSON.stringify(title)}`,
  ].join('\n');

  let result;
  let text = '';
  let parsed = {};
  try {
    result = await model.generateContent(prompt);
    text = result?.response?.text?.() ?? '';
    parsed = safeParseJsonFromText(text) || {};
  } catch (err) {
    return {
      priority: null,
      estimatedTime: null,
      suggestedDeadline: null,
      raw: { error: err.message || 'Generation failed' },
    };
  }

  const normalized = {
    priority: normalizePriority(parsed.priority),
    estimatedTime: coerceHours(parsed.estimatedTime),
    suggestedDeadline: coerceDate(parsed.suggestedDeadline),
    raw: { modelText: text, parsed },
  };

  return normalized;
}

module.exports = {
  analyzeTaskTitle,
  getGeminiModel,
  safeParseJsonFromText,
};

