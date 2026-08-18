// Reader-facing version of the slop taxonomy that the engine works from
// (lib/slop-prompt.js). Kept as structured data so /learn (the hub) and the
// /learn/[category] spoke pages can render from it. If you change the
// categories in the prompt, update these to match.

export const TAXONOMY = [
  {
    id: "buzz-verbs",
    title: "Buzz verbs",
    blurb:
      "Verbs that sound like motion but describe none. AI reaches for them to seem energetic.",
    why: "Marketing and press copy — where these verbs are everywhere — fill the training data, so a model reaches for them as default 'business energy' even when nothing is actually happening.",
    tells: ["delve", "leverage", "unlock", "elevate", "empower", "supercharge", "revolutionize"],
  },
  {
    id: "stock-framings",
    title: "Stock framings",
    blurb:
      "Prefab openers and scaffolds that could bolt onto any topic without changing meaning.",
    why: "These scaffolds appear so often that a model uses them to 'sound like an article' before it has anything specific to say.",
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
    why: "Models optimize for fluent, balanced-sounding prose, which drifts toward symmetrical structures and throat-clearing regardless of the actual content.",
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
    why: "Intensifiers and decorative adverbs pad a sentence toward the average length and confidence of the training data without adding any information.",
    tells: ["truly", "incredibly", "significantly", "quietly transforms", "seamlessly runs"],
  },
  {
    id: "fake-balance",
    title: "Fake balance",
    blurb:
      "Reflexively airing an 'on the other hand' the author never actually held, to seem even-handed.",
    why: "Instruction tuning rewards sounding measured and even-handed, so the model manufactures counterpoints the author never intended.",
    tells: ["on the other hand…", "that said…", "however, some might argue…"],
  },
  {
    id: "detector-bait",
    title: "Detector-bait vocabulary",
    blurb:
      "Words statistically overrepresented in LLM text — the ones AI-detection tools flag first.",
    why: "These words are statistically overrepresented in model output — which is exactly why detectors flag them and why they read as machine-written.",
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
    why: "Trained on papers and abstracts, models fall into journal cadence — stock openers and furthermore/moreover chains — whenever they're asked to sound authoritative.",
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
    why: "Asked to hit a length, a model restates and transitions to fill the space instead of adding new substance.",
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
    why: "Platforms reward these hooks, so they saturate the training data and resurface whenever a model is asked to write a post.",
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
    why: "The one-line-per-paragraph 'thought leader' format is everywhere on LinkedIn, so models reproduce its rhythm as a stand-in for emphasis.",
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
    why: "Contrarian 'most people X, winners Y' framing performs well online, so models learn it as a reliable way to sound insightful.",
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
    why: "Question chains and transformation arcs are viral-post patterns the model mimics to seem compelling.",
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
    why: "This is the model's own assistant voice — sign-offs and preambles from its instruction tuning that get pasted in along with the useful text.",
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
