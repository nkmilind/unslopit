// Word-level diff between the original draft and the rewrite.
// Returns ops: [{ type: "same" | "del" | "ins", text }], with runs merged.
// Newlines are preserved as "⏎" tokens so paragraph breaks survive the redline view.

const NL = "⏎";

function tokenize(t) {
  return (t || "")
    .replace(/\r/g, "")
    .replace(/\n/g, ` ${NL} `)
    .trim()
    .split(/[ \t]+/)
    .filter(Boolean);
}

export function wordDiff(original, rewritten) {
  const A = tokenize(original);
  const B = tokenize(rewritten);
  const n = A.length;
  const m = B.length;

  // LCS dynamic programming table (fine for drafts up to a few thousand words)
  const W = m + 1;
  const dp = new Uint16Array((n + 1) * W);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i * W + j] =
        A[i] === B[j]
          ? dp[(i + 1) * W + j + 1] + 1
          : Math.max(dp[(i + 1) * W + j], dp[i * W + j + 1]);
    }
  }

  // Backtrack into ops
  const raw = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      raw.push({ type: "same", token: A[i] });
      i++;
      j++;
    } else if (dp[(i + 1) * W + j] >= dp[i * W + j + 1]) {
      raw.push({ type: "del", token: A[i] });
      i++;
    } else {
      raw.push({ type: "ins", token: B[j] });
      j++;
    }
  }
  while (i < n) raw.push({ type: "del", token: A[i++] });
  while (j < m) raw.push({ type: "ins", token: B[j++] });

  // Merge consecutive tokens of the same type into runs; drop deleted line
  // breaks (a struck-through paragraph break renders as noise).
  const ops = [];
  for (const op of raw) {
    if (op.token === NL) {
      if (op.type === "del") continue;
      ops.push({ type: "break" });
      continue;
    }
    const last = ops[ops.length - 1];
    if (last && last.type === op.type && last.type !== "break") {
      last.text += " " + op.token;
    } else {
      ops.push({ type: op.type, text: op.token });
    }
  }
  return ops;
}
