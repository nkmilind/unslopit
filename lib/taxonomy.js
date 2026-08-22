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
        "Microsoft Fabric is a unified analytics solution that seamlessly integrates data and analytics tools into a single AI-powered platform designed to empower businesses with seamless data management and advanced analytics capabilities.",
      who: "Adobe",
      what: "official Adobe blog post",
      url: "https://blog.adobe.com/en/publish/2024/11/19/adobe-microsoft-strengthen-partnership-to-empower-marketing-teams-accelerate-business-outcomes",
      marks: ["seamlessly integrates", "seamless data management"],
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
      "Let me be clear,",
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
    // Optional per-page SEO overrides (used by the spoke's generateMetadata).
    metaTitle: "The most overused ChatGPT words (and what to write instead)",
    metaDescription:
      "The words AI overuses most — intricate, pivotal, tapestry, underscores — grouped by what they really mean, why AI reaches for them, and how to cut them.",
    why: "These words are statistically overrepresented in model output — which is exactly why detectors flag them and why they read as machine-written.",
    tells: [
      "intricate",
      "pivotal",
      "crucial",
      "tapestry",
      "multifaceted",
      "underscores",
      "solidifies its position",
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
      "What most people get wrong",
      "The result? Freedom.",
    ],
    example: {
      quote:
        "You can prioritize features with ease, and the best part? Capturing and integrating customer feedback is a breeze.",
      who: "ProdPad",
      what: "product blog post",
      url: "https://www.prodpad.com/blog/product-release-vs-product-launch/",
      marks: ["and the best part?"],
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
      "The question isn't X, it's Y.",
    ],
    example: {
      quote: "Most of the time, it's not about having a gift. It's about having grit.",
      who: "Roger Federer",
      what: "Dartmouth commencement address",
      url: "https://home.dartmouth.edu/news/2024/06/2024-commencement-address-roger-federer",
      marks: ["it's not about having a gift", "It's about having grit"],
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
      quote:
        "This isn't just an evolution of technology. It's a revolution that will fundamentally redefine how humans work, live, and connect with one another from this point forward.",
      who: "Marc Benioff",
      what: "op-ed in TIME",
      url: "https://time.com/collections/davos-2025/7178872/agents-unlimited-age/",
      marks: ["This isn't just an evolution of technology", "It's a revolution"],
    },
  },
  {
    id: "insight-announcement",
    title: "Insight announcement",
    blurb:
      "Badging a sentence as the important part — 'the key insight is', 'the tell is', or a noun phrase and a colon before a dramatic reveal — instead of writing it so the point lands on its own.",
    why: "Thought-leadership writing in the training data constantly flags its own takeaways, so the model announces an insight instead of trusting the sentence to deliver it.",
    tells: [
      "The key insight is",
      "The crux is",
      "The punchline is",
      "The kicker?",
      "The tell is",
      "Why this matters:",
      "Verdict:",
      "This is the decision that actually matters.",
      "The best part: it learns",
      "The detail that makes it work:",
    ],
    example: {
      quote:
        "The key insight is that present and lagged CO2 growth contains valuable information about the likelihood of future disaster events.",
      who: "Scientific Reports",
      what: "peer-reviewed journal (Springer Nature)",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11586419/",
      marks: ["The key insight is"],
    },
  },
  {
    id: "chatbot-residue",
    title: "Chatbot residue",
    blurb:
      "Assistant sign-offs and preambles left in from a copy-paste — the clearest giveaway of all.",
    why: "This is the model's own assistant voice — sign-offs and preambles from its instruction tuning that get pasted in along with the useful text.",
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
  {
    id: "emoji-inflation",
    title: "Emoji inflation",
    blurb:
      "Emoji used as decoration and scaffolding rather than expression — a badge on every heading, a marker on every bullet, and a rocket bolted to every announcement.",
    why: "Chat and social interfaces taught the model that emoji read as energy and structure, so it staples them onto headings, bullets, and announcements by default — the visual cousin of exclamation inflation.",
    tells: [
      "🚀 in every announcement",
      "✅ as bullet points",
      "Key takeaways 📌",
      "emoji-per-list-item",
      "✨ around any claim of quality",
    ],
    example: {
      quote: "⭐️ Explore what's new with GitHub Copilot ⭐️",
      who: "GitHub",
      what: "product-news blog post",
      url: "https://github.blog/news-insights/product-news/universe-2024-previews-releases/",
      marks: ["⭐️"],
    },
  },
  {
    id: "superficial-analysis",
    title: "Superficial analysis",
    blurb:
      "Empty trailing clauses that pretend to explain — 'highlighting', 'underscoring', 'reflecting' — bolted onto a fact without adding one.",
    why: "Trained on press releases and reports, the model appends an interpretive participial clause to sound analytical, even when it only restates the fact in vaguer terms.",
    isNew: true,
    tells: [
      "highlighting the team's commitment",
      "underscoring the importance of",
      "reflecting a broader shift",
      "showcasing its dedication to",
      "demonstrating the value of",
    ],
    example: {
      quote:
        "…has released its 2024 Sustainability Report titled \"Built to Last,\" underscoring its dedication to operating an organization that is prepared for the future and designed to thrive in it.",
      who: "Crown Holdings",
      what: "press release",
      url: "https://www.prnewswire.com/news-releases/crown-holdings-announces-built-to-last-2024-sustainability-report-underscoring-commitment-to-future-forward-progress-302494747.html",
      marks: ["underscoring its dedication to"],
    },
  },
  {
    id: "weasel-words",
    title: "Weasel words",
    blurb:
      "Vague, unsourced authority — 'experts agree', 'studies show', 'widely regarded as' — that borrows credibility without naming a source.",
    why: "The model mimics the confident register of journalism and marketing, which lean on anonymous authorities, so it asserts a consensus it can't attribute.",
    isNew: true,
    tells: [
      "experts agree",
      "studies show",
      "research suggests",
      "widely regarded as",
      "many argue",
      "it is widely believed",
    ],
    example: {
      quote:
        "Experts believe this debate will dominate the workplace in 2024 as leaders look for a healthy balance.",
      who: "Forbes",
      what: "opinion article",
      url: "https://www.forbes.com/sites/bryanrobinson/2024/02/12/embrace-the-fact-that-ai-will-dominate-careers-in-2024-experts-say/",
      marks: ["Experts believe"],
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
