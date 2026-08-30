// Small text helpers shared by AI providers. Kept separate from any one
// provider so a future real provider can reuse them (e.g. to pre-clean
// tutor input before sending it to a model).

export function splitPhrases(text, max = 6) {
  if (!text) return [];
  return text
    .split(/[,;\n.]+/)
    .map((phrase) => phrase.trim())
    .filter(Boolean)
    .map((phrase) => phrase.charAt(0).toUpperCase() + phrase.slice(1))
    .slice(0, max);
}

export function extractScore(text) {
  if (!text) return null;
  const match = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return null;
  const correct = Number(match[1]);
  const total = Number(match[2]);
  if (!total) return null;
  return { correct, total, ratio: correct / total };
}

export function lowerFirst(text) {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}
