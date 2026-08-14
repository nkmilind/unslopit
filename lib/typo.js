// Introduce exactly one natural-looking typo so the output reads as human-written.
// We do this server-side rather than asking the model, which is unreliable at it.
// The typo is an interior-letter transposition (e.g. "process" -> "porcess") on a
// single mid-text word — the most common real human slip, and meaning-preserving.

function transposeInterior(word) {
  // Try each interior adjacent pair; return the first swap that visibly changes
  // the word (skips doubled letters like the "ss" in "process").
  for (let i = 1; i < word.length - 2; i++) {
    if (word[i] !== word[i + 1]) {
      return word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2);
    }
  }
  return null;
}

// Returns { text, word, index }: the typo'd text, the misspelled word, and its
// character offset in text (so the UI can mark it). index is -1 if none added.
export function injectTypo(text) {
  const none = { text, word: null, index: -1 };
  if (typeof text !== "string" || !text.trim()) return none;

  // Split keeping whitespace so we can rejoin exactly. Word tokens are 5+ letters.
  const tokens = text.split(/(\s+)/);
  const candidates = [];
  for (let i = 0; i < tokens.length; i++) {
    if (/^[A-Za-z]{5,}$/.test(tokens[i])) candidates.push(i);
  }
  if (candidates.length < 3) return none; // too short to place a typo unobtrusively

  // Prefer words near the middle; never the first or last candidate word.
  const inner = candidates.slice(1, -1);
  const ordered = [...inner].sort(
    (a, b) => Math.abs(a - tokens.length / 2) - Math.abs(b - tokens.length / 2)
  );
  for (const idx of ordered) {
    const swapped = transposeInterior(tokens[idx]);
    if (swapped) {
      const index = tokens.slice(0, idx).join("").length;
      tokens[idx] = swapped;
      return { text: tokens.join(""), word: swapped, index };
    }
  }
  return none;
}
