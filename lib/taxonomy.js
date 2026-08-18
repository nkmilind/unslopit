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
    // ONE real, published example per tell — quoted verbatim from a named
    // brand/company (or public figure) for commentary, with a source link.
    // `marks` are the exact substrings to highlight (the tell itself); the
    // renderer wraps each occurrence, case-insensitive. Keep `quote`
    // word-for-word with the source. Editing examples does NOT require a
    // slop-prompt.js change.
    example: {
      quote:
        "Braze Unveils Powerful New Features to Supercharge Creativity and Help Marketers Build Personalized, Real-time Experiences Across Channels",
      who: "Braze",
      what: "product-launch press release",
      url: "https://www.braze.com/press-releases/braze-forge-2025-product-launch",
      marks: ["Supercharge"],
    },
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
    example: {
      quote:
        "In today's fast-paced digital landscape, traditional marketing methods alone can no longer suffice in driving business growth and success.",
      who: "Treelancerology Media",
      what: "marketing press release",
      url: "https://www.einpresswire.com/article/677390669/unlocking-the-power-of-digital-marketing-a-must-for-business-growth-and-success-in-todays-fast-paced-digital-landscape",
      marks: ["In today's fast-paced digital landscape"],
    },
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
    example: {
      quote: "Smarter, Faster, Better: Inside the ESP+ November 2025 Release",
      who: "ASI (Advertising Specialty Institute)",
      what: "product-release announcement",
      url: "https://asicentral.com/esp-release/smarter-faster-better-inside-the-esp-november-2025-release/",
      marks: ["Smarter, Faster, Better"],
    },
  },
  {
    id: "empty-intensity",
    title: "Empty intensifiers & adverbs",
    blurb:
      "Words that turn up the volume without adding information — including adverbs bolted onto plain verbs.",
    why: "Intensifiers and decorative adverbs pad a sentence toward the average length and confidence of the training data without adding any information.",
    tells: ["truly", "incredibly", "significantly", "quietly transforms", "seamlessly runs"],
    example: {
      quote:
        "Which takes us to some unexpected, wild and wonderful places to create brands that have the power to be truly transformative.",
      who: "Wolff Olins",
      what: "brand-agency web copy",
      url: "https://wolffolins.com/news/the-wolff-olins-way-creating-transformative-brands-that-move-the-world",
      marks: ["truly"],
    },
  },
  {
    id: "fake-balance",
    title: "Fake balance",
    blurb:
      "Reflexively airing an 'on the other hand' the author never actually held, to seem even-handed.",
    why: "Instruction tuning rewards sounding measured and even-handed, so the model manufactures counterpoints the author never intended.",
    tells: ["on the other hand…", "that said…", "however, some might argue…"],
    example: {
      quote:
        "That said, there are ways to create content that's digestible and useful to readers.",
      who: "HubSpot",
      what: "marketing blog post",
      url: "https://blog.hubspot.com/marketing/the-ins-and-outs-of-writing-long-form-content",
      marks: ["That said,"],
    },
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
    example: {
      quote:
        "the new report from McLean & Company examines pivotal trends that must be considered and prioritized in the coming year",
      who: "McLean & Company",
      what: "press release",
      url: "https://www.prnewswire.com/news-releases/hrs-role-as-strategic-partner-stagnates-for-first-time-in-four-years-hr-must-adapt-to-shifting-priorities-and-demonstrate-data-backed-roi-in-2025-says-new-trends-report-from-mclean--company-302343442.html",
      marks: ["pivotal"],
    },
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
    example: {
      quote:
        "It recognizes the intricate interplay between individualized medical approaches, the multifaceted nature of human personality, and the integration of relevant information.",
      who: "Journal of Public Health and Emergency",
      what: "peer-reviewed article",
      url: "https://jphe.amegroups.org/article/view/9442/html",
      marks: ["the intricate interplay between", "multifaceted"],
    },
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
    example: {
      quote: "Before moving on, let's recap what we've covered real quick:",
      who: "Ryan Robinson",
      what: "long-form blogging guide",
      url: "https://www.ryrob.com/dont-start-blog/",
      marks: ["let's recap what we've covered"],
    },
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
    example: {
      quote: "Here's the thing: Google doesn't want you to read blogs.",
      who: "Seth Godin",
      what: "blog post",
      url: "https://seths.blog/2016/06/read-more-blogs/",
      marks: ["Here's the thing:"],
    },
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
    // Multi-line quote: the line-per-sentence FORMAT is the tell, so `marks`
    // is empty and the renderer preserves newlines (white-space: pre-line).
    example: {
      quote: `A stranger changed my life on a Tuesday.
I was broke. Down to my last $40.
He bought my coffee and said seven words I'll never forget:
"Bet on yourself. Nobody else will."
That was 2019.
Today I run a seven-figure agency.`,
      who: "ContentIn",
      what: "illustration from its broetry glossary",
      url: "https://contentin.io/glossary/broetry/",
      marks: [],
    },
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
    example: {
      quote:
        "You don't need to be a genius or a visionary, or even a college graduate for that matter, to be successful. You just need a framework and a dream.",
      who: "Michael Dell",
      what: "quoted in Entrepreneur",
      url: "https://www.entrepreneur.com/living/20-motivational-quotes-to-inspire-your-next-business-idea/301171",
      marks: ["You don't need to be a genius", "You just need"],
    },
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
    example: {
      quote: "This is not just food, this is M&S food",
      who: "Marks & Spencer",
      what: "advertising slogan",
      url: "https://en.wikipedia.org/wiki/Marks_%26_Spencer",
      marks: ["This is not just food"],
    },
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
    example: {
      quote:
        "I'm sorry but I cannot fulfill this request it goes against OpenAI use policy",
      who: "Amazon seller listing (reported by Futurism)",
      what: "product title left with AI refusal text",
      url: "https://futurism.com/amazon-products-ai-generated",
      marks: ["I'm sorry but I cannot fulfill this request"],
      // `artifact` renders the "C" treatment — a reconstructed source frame
      // (honestly captioned) instead of the plain clipping.
      artifact: {
        chrome: "amazon.com",
        thumb: true,
        tail: ", My purpose is to provide helpful and respectful information to users-Brown Dresser",
        price: "199",
        cents: "99",
      },
    },
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
