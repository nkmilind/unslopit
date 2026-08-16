# UnSlopIt.ai

Turn AI slop into text that sounds like a person wrote it. Instant AI edit by default; human editor in 1 hour as the upgrade.

## What's in this scaffold

```
unslopit/
├── app/
│   ├── layout.jsx            # Root layout, fonts, metadata
│   ├── page.jsx              # The full UI (draft → AI pass / human pass)
│   ├── globals.css           # UnSlopIt visual identity (red-pen editorial theme)
│   └── api/
│       └── unslop/
│           └── route.js      # Server-side endpoint that calls the Anthropic API
├── lib/
│   └── slop-prompt.js        # THE PRODUCT: slop taxonomy + rewrite rules + few-shots
├── .env.example              # Copy to .env.local and add your key
└── package.json
```

Key architecture point: the browser never talks to Anthropic. `page.jsx` posts the draft to `/api/unslop`, which runs on the server and holds your API key as an environment variable.

## Step 1 — Run it locally

1. Install Node.js 20+ (nodejs.org).
2. In this folder:
   ```bash
   npm install
   cp .env.example .env.local
   ```
3. Get an API key from console.anthropic.com → API Keys, and paste it into `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000, hit "Try a sample", then "⚡ UnSlopIt now". You should get a rewrite plus the red-pen change list within a few seconds.

## Step 2 — Put it on GitHub

```bash
git init
git add .
git commit -m "UnSlopIt scaffold"
```
Create an empty repo on github.com, then:
```bash
git remote add origin https://github.com/YOURNAME/unslopit.git
git push -u origin main
```
(`.gitignore` already excludes `.env.local`, so your key never leaves your machine.)

## Step 3 — Deploy to Vercel

1. vercel.com → Add New Project → import the `unslopit` repo. Vercel auto-detects Next.js; accept the defaults.
2. Before deploying, add the environment variable: Settings → Environment Variables → `ANTHROPIC_API_KEY` = your key (Production + Preview).
3. Deploy. You'll get a live `*.vercel.app` URL in ~1 minute.

## Step 4 — Connect unslopit.ai

1. Vercel project → Settings → Domains → add `unslopit.ai` (and `www.unslopit.ai`).
2. At your registrar, add the DNS records Vercel shows you (an A record to Vercel's IP for the apex, CNAME for www).
3. Wait for DNS to propagate (minutes to a few hours). HTTPS is automatic.

## Step 5 — Tune the prompt (your moat)

Everything that makes UnSlopIt good lives in `lib/slop-prompt.js`.

1. Build a test set first: 20–30 real slop samples in a `/eval` folder with notes on what a good edit looks like.
2. Run every prompt change against the whole set before shipping. Watch for regressions — fixing one tell often un-fixes another.
3. Add few-shot examples for the content types your users actually paste (LinkedIn posts, cold emails, blog intros). Few-shots move quality more than instructions do.

## Step 6 — Production hardening (before real traffic)

- **Rate limiting:** the route currently trusts everyone. Add per-IP limits with Upstash Ratelimit (works on Vercel serverless) before launch, or your Anthropic bill is an open tap.
- **Long drafts:** requests are capped at 1,000 words (`MAX_WORDS` in `route.js`). To go higher, chunk on paragraph boundaries, edit chunks in parallel, and reassemble.
- **Streaming:** for long rewrites, switch the route to Anthropic's streaming API and stream tokens to the client so the result appears as it's written.
- **Model choice:** the model is pinned in `route.js` (`MODEL`). Check docs.claude.com for current model strings and pricing; Sonnet-class is the right speed/quality tradeoff for this workload.

## Step 7 — Build the human-editor backend

The "Send to an editor" button currently creates a mock order (see the TODO in `page.jsx`). The MVP path:

1. **Database:** Supabase — one `orders` table (id, text, notes, email, words, pages, price, status, deadline).
2. **Payment:** Stripe Checkout — create a Checkout Session in a new `/api/order` route; on the `checkout.session.completed` webhook, write the order and start the clock.
3. **Editor notification:** on new order, ping yourself via Slack webhook or email (Resend).
4. **Fulfillment:** a `/admin` page listing open orders with a "complete" form that emails the finished edit to the customer. You + a Gmail tab is a fine v1.
5. **The 1-hour promise:** gate the human option to staffed hours, or compute the promised deadline from an on-call schedule. Build this logic before launch — refunds for missed SLAs are worse.

## Costs at prototype scale

Vercel free tier + Anthropic pay-as-you-go. A typical 500-word edit costs a fraction of a cent in tokens; you can run thousands of free edits before infrastructure costs matter.
