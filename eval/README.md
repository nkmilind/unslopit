# Prompt eval set

The slop prompt (`lib/slop-prompt.js`) is the product. Run every change to it
against this set **before** shipping — fixing one tell often un-fixes another.

## Run it

```bash
npm run eval              # default (medium) edit strength
npm run eval -- --level full
npm run eval -- --level light
```

It reads `ANTHROPIC_API_KEY` from `.env.local`, sends each case through the real
system prompt, prints a per-case result, and writes `eval/last-run.json`.

## How to read the output

Each case declares:

- **`mustCut`** — phrases that should be *gone* from the rewrite. If one survives → **FAIL**.
- **`mustKeep`** — content that should *survive* (facts, numbers, the point, legit words). If one is missing → **REVIEW**.

Statuses:

- **PASS** — all tells cut, all content kept.
- **REVIEW** — a `mustKeep` phrase went missing. Often fine (the model paraphrased and kept the *meaning*), sometimes a real over-edit that dropped a fact or a legit word. **Read these.** This is where the "don't blanket-ban" risk shows up — e.g. a `clean-*` case losing "crucial"/"robust" or a number.
- **FAIL** — a tell leaked through. A regression.
- **ERROR** — the API call or JSON parse failed.

The checker is substring matching — a **signal, not a judge**. Two cases can't
be auto-scored well and always need eyeballing: `staccato` (did it merge the
one-line paragraphs into prose?) and any `clean-*` case (did the voice/length
stay intact, or did it get inflated?).

## Cases

`cases.json`. Each has `type` (`slop` = has tells to remove, `clean` =
false-positive guard that should come back nearly unchanged), a `label` tied to
a taxonomy category, and a `note` on what a good edit looks like.

Add real slop you run into — the set is only as good as its coverage. Aim to
keep at least a few `clean` cases per risky word so over-editing gets caught.
