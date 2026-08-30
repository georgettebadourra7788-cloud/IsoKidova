// Small text helpers shared by AI providers. Kept separate from any one
// provider so a future real provider can reuse them (e.g. to pre-clean
// tutor input before sending it to a model).

// A comma followed by one of these almost always continues the same clause
// ("...multiplication tables, especially 6-9, and sometimes mixes up...")
// rather than starting a new list item ("Multiplication tables, reading
// comprehension"). Splitting on every comma treated a single sentence like
// the first example as three unrelated "skills" - this keeps such clauses
// together while still splitting genuine comma-separated lists.
const CONTINUATION_WORD = /^(and|but|or|so|especially|which|that|because|since|though|although|while|plus|including|particularly)\b/i;

// Tutors often describe a weakness as a sentence ("Emma has difficulty with
// multiplication tables...") rather than a bare topic. Stripping a leading
// "<name> has difficulty/trouble with", "struggles with", etc. leaves just
// the topic, which reads naturally once dropped into a template ("Needs
// additional practice with multiplication tables...") and avoids
// mid-sentence proper nouns (e.g. "Emma") ending up lowercased.
const LEAD_IN = /^.*?\b(?:has (?:a hard time|difficulty|trouble) with|struggles? with|trouble with|weak (?:in|at)|is weak (?:in|at)|finds? .*? difficult|needs? (?:help|improvement) (?:with|in))\s+/i;

function splitOnCommaBoundaries(sentence) {
  const parts = sentence
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const phrases = [];
  let current = "";
  for (const part of parts) {
    if (!current) {
      current = part;
    } else if (CONTINUATION_WORD.test(part)) {
      current += `, ${part}`;
    } else {
      phrases.push(current);
      current = part;
    }
  }
  if (current) phrases.push(current);
  return phrases;
}

export function splitPhrases(text, max = 6) {
  if (!text) return [];
  // Newlines/semicolons/periods are always real separators; commas are
  // handled per-sentence above since they're often grammatical, not list
  // separators.
  const sentences = text
    .split(/[\n;.]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return sentences
    .flatMap(splitOnCommaBoundaries)
    .map((phrase) => phrase.replace(LEAD_IN, "").trim())
    .filter(Boolean)
    .map((phrase) => phrase.charAt(0).toUpperCase() + phrase.slice(1))
    .slice(0, max);
}

// A short, template-friendly version of a phrase - used anywhere the text
// gets embedded mid-sentence (a day's focus skill / activity description),
// where a full clause ("...especially 6-9, and sometimes mixes up word
// problems") reads better trimmed down to just its first, concrete part.
export function shortLabel(phrase, maxWords = 6) {
  if (!phrase) return phrase;
  const commaIndex = phrase.indexOf(",");
  const base = commaIndex > 0 ? phrase.slice(0, commaIndex) : phrase;
  const words = base.trim().split(/\s+/);
  return words.length <= maxWords ? base.trim() : words.slice(0, maxWords).join(" ");
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
