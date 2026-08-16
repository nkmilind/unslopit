// Reader-facing version of the slop taxonomy that the engine works from
// (lib/slop-prompt.js). Kept as structured data so the /learn page can render
// and deep-link each category. If you change the categories in the prompt,
// update these to match.

export const TAXONOMY = [
  {
    id: "buzz-verbs",
    title: "Buzz verbs",
    blurb:
      "Verbs that sound like motion but describe none. AI reaches for them to seem energetic.",
    tells: ["delve", "leverage", "unlock", "elevate", "empower", "supercharge", "revolutionize"],
  },
  {
    id: "stock-framings",
    title: "Stock framings",
    blurb:
      "Prefab openers and scaffolds that could bolt onto any topic without changing meaning.",
    tells: [
      "in today's fast-paced digital landscape",
      "it's not just X, it's Y",
      "a testament to",
      "game-changing",
      "seamless",
      "robust",
    ],
  },
  {
    id: "structural-tells",
    title: "Structural tells",
    blurb:
      "Shapes, not words: rule-of-three pileups, throat-clearing intros, and outros that restate the whole piece.",
    tells: [
      "faster, smarter, better",
      "It's important to note that…",
      "em-dash overuse",
      "exclamation inflation",
    ],
  },
  {
    id: "empty-intensity",
    title: "Empty intensifiers & adverbs",
    blurb:
      "Words that turn up the volume without adding information — including adverbs bolted onto plain verbs.",
    tells: ["truly", "incredibly", "significantly", "quietly transforms", "seamlessly runs"],
  },
  {
    id: "fake-balance",
    title: "Fake balance",
    blurb:
      "Reflexively airing an 'on the other hand' the author never actually held, to seem even-handed.",
    tells: ["on the other hand…", "that said…", "however, some might argue…"],
  },
  {
    id: "detector-bait",
    title: "Detector-bait vocabulary",
    blurb:
      "Words statistically overrepresented in LLM text — the ones AI-detection tools flag first.",
    tells: [
      "intricate",
      "pivotal",
      "crucial",
      "tapestry",
      "multifaceted",
      "underscores",
      "plays a crucial role",
    ],
  },
  {
    id: "academic-filler",
    title: "Academic filler",
    blurb:
      "Journal-flavored padding: stock openers, furthermore/moreover chains, conclusions that restate the abstract.",
    tells: [
      "In recent years, there has been growing interest in…",
      "the intricate interplay between",
      "holistic framework",
    ],
  },
  {
    id: "longform-padding",
    title: "Long-form padding",
    blurb:
      "The bloat of guides and e-books: re-stating the premise each section, hollow transitions, filler chapters.",
    tells: [
      "Now that we've covered X, let's turn to Y",
      "In conclusion,",
      "In summary,",
    ],
  },
  {
    id: "engagement-bait",
    title: "Engagement bait",
    blurb:
      "Rhetoric engineered for the scroll — commands to react, teased secrets, one-word dramatic answers.",
    tells: [
      "Read that again.",
      "Let that sink in.",
      "Here's the thing:",
      "Nobody talks about this…",
      "The result? Freedom.",
    ],
  },
  {
    id: "staccato",
    title: "Staccato formatting",
    blurb:
      "Every sentence its own paragraph, escalation chains, and two-word manifestos posing as emphasis.",
    tells: [
      "one sentence per line",
      "Five became fifty. Fifty became a movement.",
      "Build quietly. Learn constantly.",
    ],
  },
  {
    id: "false-binaries",
    title: "False binaries & fake reversals",
    blurb:
      "Manufactured either/or framings and fake contrarianism that flatter the reader.",
    tells: [
      "Most people X. Successful people Y.",
      "You don't need X. You need Y.",
      "Everyone says X. They're wrong.",
    ],
  },
  {
    id: "manufactured-drama",
    title: "Manufactured drama",
    blurb:
      "Question chains delaying a trivial answer, transformation arcs, and fake-elevation reversals.",
    tells: [
      "This isn't a budget. It's a statement of intent.",
      "It changed everything.",
      "Simple? Yes. Easy? No.",
    ],
  },
  {
    id: "chatbot-residue",
    title: "Chatbot residue",
    blurb:
      "Assistant sign-offs and preambles left in from a copy-paste — the clearest giveaway of all.",
    isNew: true,
    tells: [
      "Hope this helps!",
      "Let me know if you have any questions",
      "Certainly!",
      "After careful consideration,",
      "As an AI language model,",
    ],
  },
];

// Proven rewrites (drawn from the engine's own few-shot examples).
export const BEFORE_AFTER = [
  {
    label: "Marketing / LinkedIn",
    before:
      "In today's fast-paced digital landscape, it's important to note that email marketing isn't just about sending messages — it's about crafting meaningful connections that truly resonate.",
    after:
      "Email marketing works when the message gives the reader a reason to care. Most don't.",
    caught: ["stock framing", "it's-not-just-X-it's-Y", "empty intensifier"],
  },
  {
    label: "Chatbot residue",
    before:
      "After careful consideration, our new platform quietly transforms how teams collaborate — it's robust, seamless, and built for the modern workplace. Hope this helps! Let me know if you have any questions.",
    after:
      "Our platform changes how teams work together. Try it and tell us what breaks.",
    caught: ["empty preamble", "adverb abuse", "stacked buzzwords", "chatbot sign-off"],
  },
  {
    label: "Hustle post / false binary",
    before:
      "Most people manage time. Successful people manage energy. Read that again. It's not about doing more. It's about doing less. Better. The secret? Consistency.",
    after:
      "Managing your energy matters more than managing your time. Doing fewer things well beats doing more — and consistency is what makes it stick.",
    caught: ["false binary", "engagement bait", "fake reversal", "staccato formatting"],
  },
];
