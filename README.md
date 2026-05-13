# Watch2Build

## The insight

Most developers watch tutorials passively. They finish the video, nod along, and never build the thing. Not because they lack motivation — because the gap between **watching** and **shipping** is never bridged.

**Watch2Build** closes that gap with a structured, actionable project plan. Paste a URL. Get back what a senior engineer would tell you before you started building.

---

## What it does

Paste a **YouTube coding tutorial** URL. The app pulls the transcript, runs it through AI, and returns:

| Output | What you get |
|--------|----------------|
| **What this actually teaches** | Concrete skills (not “you learn React”) |
| **What to skip** | Filler or optional sections with **timestamp ranges** — deep-linked to YouTube so you can jump straight there |
| **Tech stack** | Tools that show up in the tutorial, with what each one does *in this project* |
| **Architecture** | Short overview + main components |
| **Build order & roadmap** | Phased milestones, **4–6 hours/day** style estimates (not “video length”), tasks per phase, deliverables |
| **Checkpoints** | Completion-style signals so you know when a slice is really done |
| **Beginner traps** | Mistakes people actually hit, with fixes (prompt pushes for specificity + optional `timeToDebug` in the model output) |
| **Task board** | Every roadmap task as a **kanban** card: To Do → In Progress → Done (client-side, drag between columns) |
| **Launch** | Deployment checklist + **resume bullet** + **MVP definition** |

---

## Why this and not something else

Transcript summarizers exist. Generic “AI project planners” exist. The mix here is deliberate: **skip list + jumpable timestamps**, **trap hunting**, and **roadmap/tasks tied to observable progress** — born from the usual failure mode: a 3-hour tutorial, a cryptic error, and no idea *where in the video* the fix lives.

**Intentionally left out:** user accounts, saved plans, course tracking, social features, comments, database, auth, external file storage. Those are retention and infra layers. The core loop — **paste URL → get a plan** — does not need them to prove value.

---

## Demo

| | |
|--|--|
| **Input** | Any public YouTube coding tutorial URL with captions (or paste transcript manually if extraction fails) |
| **Output** | Full dashboard: Overview · Roadmap · Task Board · Danger Zones · Launch |
| **Time** | Roughly **10–30 seconds** depending on transcript length and model latency |

---

## Stack

| Layer | Choice |
|--------|--------|
| Framework | **Next.js 14** (App Router), **TypeScript**, React 18 |
| Motion | **Framer Motion** (tab transitions, landing motion), **Lenis** (smooth scroll) |
| Styling | **CSS variables** in `app/globals.css` + inline styles (design tokens work like a Tailwind palette without Tailwind in the bundle) |
| Transcript | **`youtube-transcript`**, timedtext page scrape, optional fallbacks (e.g. kome), **manual paste** |
| AI | **Optional Gemini** → **Groq** (`llama-3.3-70b-versatile`) → **OpenRouter** HTTP fallback with a small free-model chain (see `app/api/analyze/route.ts`) |

**No database. No auth. No blob storage.** The happy path is two API routes: transcript → analyze.

---

## Architecture

```
User pastes URL
       │
       ▼
┌──────────────────┐
│  POST /api/transcript   │
│  1. youtube-transcript  │
│  2. timedtext scrape    │
│  3. third-party hook    │  (placeholder / off by default)
│  4. kome.ai fallback    │
│  OR manualTranscript    │  ← always works if user pastes text
└──────────┬─────────────┘
           │ transcript text
           ▼
┌──────────────────┐
│  POST /api/analyze    │
│  1. Gemini (if GEMINI_API_KEY) │
│  2. Groq (GROQ_API_KEY)         │
│  3. OpenRouter chain            │  AI_API_URL + AI_API_KEY
│  JSON parse + hour total fix    │  (re-sums roadmap hours)
└──────────┬─────────────┘
           ▼
    Dashboard — 5 tabs
    Overview | Roadmap | Task Board |
    Danger Zones | Launch
```

---

## Getting started

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/Dheeraj0608/Watch2Build.git
cd Watch2Build
npm install
```

Create **`.env.local`** at the repo root (never commit this file):

```env
# At least one analysis path should work:

# Optional — tried first if set
# GEMINI_API_KEY=

# Recommended — fast Groq path
GROQ_API_KEY=your_groq_key

# Fallback — OpenRouter-compatible chat completions URL + key
AI_API_URL=https://openrouter.ai/api/v1/chat/completions
AI_API_KEY=your_openrouter_key
```

The app does **not** read a separate `AI_MODEL` env var; OpenRouter fallback models are defined in code (`MODEL_FALLBACK_CHAIN` in `app/api/analyze/route.ts`).

**Keys**

- [Groq console](https://console.groq.com) (free tier with rate limits)
- [OpenRouter](https://openrouter.ai) (free-tier models used in the fallback chain)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste a tutorial URL.

**Production**

```bash
npm run build
npm start
```

---

## Evaluation (how I judged quality)

I scored outputs across **three** YouTube tutorials (fullstack / frontend / backend). Each run was rated on five dimensions against **verifiable** signals where possible (description + repo for stack, comments for “took me X hours”, chapter structure for order, etc.).

| Dimension | Ground truth / proxy |
|-----------|-------------------------|
| Tech stack accuracy | Video description + linked repo `package.json` when available |
| Time estimate realism | YouTube comments mentioning hours / days / “took me” |
| Beginner trap specificity | Highly upvoted “stuck” / error comments vs generic advice |
| Build order logic | Chapter markers / obvious narrative order in transcript |
| Output completeness | Direct inspection of parsed JSON fields |

**Pass threshold:** 35/50 (70%).

### Run 1 — Baseline

| Video | Tech | Time | Traps | Order | Complete | Total |
|-------|------|------|--------|-------|----------|-------|
| Next.js SaaS | 8 | 8 | 6 | 7 | 9 | **38**/50 |
| React beginner | 9 | 8 | 7 | 8 | 9 | **42**/50 |
| FastAPI | 8 | 7 | 7 | 7 | 9 | **38**/50 |
| **Average** | **8.3** | **7.7** | **6.7** | **7.3** | **9.0** | **39.3**/50 |

All three passed (~78.6% average).

**What was weakest:** traps read correct but **generic** (categories of mistakes, not the exact error string you’d see in the terminal). Build-order “done” signals were sometimes vague.

### Run 2 — After prompt changes

Prompt updates included: explicit **bad vs good** trap examples, **minimum trap count** with a bias toward **stack-specific** traps, stricter **observable completion** language for tasks/phases, and **`timeToDebug`** on traps in the schema the model is asked to fill.

| Video | Tech | Time | Traps | Order | Complete | Total |
|-------|------|------|--------|-------|----------|-------|
| Next.js SaaS | 8 | 8 | 9 | 9 | 9 | **43**/50 |
| React beginner | 9 | 8 | 9 | 9 | 9 | **44**/50 |
| FastAPI | 8 | 8 | 8 | 9 | 9 | **42**/50 |
| **Average** | **8.3** | **8.0** | **8.7** | **9.0** | **9.0** | **43.0**/50 |

Average **39.3 → 43.0** (+3.7). Biggest lift: **traps 6.7 → 8.7** (+2.0).

**Caveats:** comments are a noisy proxy, not expert review; **n = 3**; temperature **0.3** still allows run-to-run drift; free models can degrade under **rate limits**.

---

## Prompt engineering (high level)

| Decision | Why |
|------------|-----|
| **Temperature 0.3** | More stable JSON; higher settings tended to add markdown fences or preamble and break parsing. |
| **~15k character transcript cap** | Keeps Groq / smaller windows safe while leaving room for a large system prompt. |
| **Bad / good examples in prompt** | “Be specific” produces generics; **showing** bad vs good examples pulls specificity up across fields. |
| **Recalculate `estimatedTotalHours`** | The model sometimes totals hours wrong vs the sum of milestones; the API **re-sums roadmap `estimatedHours`** before responding so tabs stay consistent. |

---

## Known limitations

- YouTube sometimes blocks or changes caption delivery — **manual transcript** path still works.
- **Free-tier quotas** (Groq / OpenRouter) are fine for demos, not bulk processing.
- **Hour estimates** are informed guesses, not guarantees.
- Videos with **no captions at all** cannot be auto-ingested (paste transcript instead).
- **`timeToDebug`** may appear in model JSON before the TS type is extended — UI today focuses on trap / why / fix.

---



## What I’d do next

1. **Tighter v1 scope** — prove the pipeline in three surfaces: one page, `/api/transcript`, `/api/analyze`; defer kanban and multi-tab chrome.
2. **Data flywheel** — optional “how long did this phase actually take?” feedback to calibrate estimates over time.
3. **B2B angle** — bootcamps and cohort-based courses care more about “did students ship?” than another $9/mo consumer SaaS.
4. **Multiple languages** — UI copy in more than one language (i18n), plus transcript / analysis paths that prefer non-English captions when the video has them, so plans aren’t English-only by default.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | ESLint |
