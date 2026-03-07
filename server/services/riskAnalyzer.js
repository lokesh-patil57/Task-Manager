const { getGeminiModel, safeParseJsonFromText } = require('./aiService');

function normalizeRiskLevel(x) {
  if (!x) return null;
  const v = String(x).toLowerCase().trim();
  if (['low', 'medium', 'high'].includes(v)) return v;
  return null;
}

function coerceDate(x) {
  if (!x) return null;
  const d = new Date(x);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function coerceHours(x) {
  if (x == null) return null;
  if (typeof x === 'number' && Number.isFinite(x)) return x;
  const n = Number(String(x).replace(/[^\d.]/g, ''));
  if (Number.isFinite(n)) return n;
  return null;
}

async function analyzeDeadlineRisk({ title, deadline, estimatedTime }) {
  const cleanTitle = title != null ? String(title) : '';
  const d = coerceDate(deadline);
  const hours = coerceHours(estimatedTime);

  if (!d) {
    return {
      riskLevel: 'low',
      suggestion: 'Add a deadline to help the AI assess delivery risk.',
      raw: { skipped: true, reason: 'missing_deadline' },
    };
  }

  const model = getGeminiModel('gemini-3-flash-preview');
  if (!model) {
    return {
      riskLevel: 'low',
      suggestion: 'Connect Gemini (set GEMINI_API_KEY) to enable deadline risk detection.',
      raw: { error: 'Missing GEMINI_API_KEY' },
    };
  }

  const prompt = [
    'Analyze the following task and determine deadline miss risk.',
    'Return ONLY valid JSON with exactly these keys:',
    '- riskLevel: "low" | "medium" | "high"',
    '- suggestion: short actionable recommendation',
    '',
    `Task: ${JSON.stringify(cleanTitle)}`,
    `Deadline: ${JSON.stringify(d.toISOString())}`,
    `EstimatedTime: ${JSON.stringify(hours)}`,
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
      riskLevel: 'medium',
      suggestion: 'AI temporarily unavailable. Keep an eye on the deadline.',
      raw: { error: err.message || 'Generation failed' },
    };
  }

  const riskLevel = normalizeRiskLevel(parsed.riskLevel) || 'medium';
  const suggestion =
    parsed.suggestion != null && String(parsed.suggestion).trim()
      ? String(parsed.suggestion).trim()
      : 'Start earlier and split the work into smaller subtasks.';

  return { riskLevel, suggestion, raw: { modelText: text, parsed } };
}

module.exports = { analyzeDeadlineRisk };

