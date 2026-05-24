# Doubt-Flow — AI-Powered Student Doubt Resolution Platform

A full-stack EdTech platform where students post academic doubts, receive instant AI-generated answers, and teachers can review, approve, or override responses. Built for a classroom environment.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

---

## Features

### Student

- **Post Doubts** — Create doubts with title, markdown description, subject, and difficulty level
- **AI Answers** — Instant AI-generated responses via OpenRouter (background job via Inngest)
- **Real-time Updates** — Loading indicator while AI generates, live polling every 3 seconds
- **Auto-Approve** — Unapproved AI answers auto-approve after configurable time (default 24h)
- **Full AI Answer Preview** — Students see the full answer immediately with a warning badge; after approval (manual or auto) the badge changes to "Verified"
- **Markdown Support** — Full markdown editor for descriptions, rendered beautifully in responses
- **My Doubts** — View, filter (All/Open/Under Review/Resolved), edit, and delete your doubts
- **Profile** — View stats, edit name, change password
- **Dashboard** — Stats overview, recent doubts feed, subject filtering, fixed sidebars with center-scroll
- **Keyboard Shortcut** — Alt+Q opens the post doubt modal from anywhere on the dashboard
- **Chat with AI** — After a doubt is answered, students can chat with AI to ask follow-up questions, request clarifications, or explore related concepts. Chat history is saved per user and streams in real-time.

### Teacher

- **Review Queue** — Dedicated page with two-panel layout (doubt list on left, selected doubt detail on right)
- **Approve / Disapprove** — Verify or reject AI-generated answers
- **Override** — Move doubt to Under Review and write your own teacher response
- **Teacher Response** — Post authoritative answers using a markdown editor
- **Edit Own Responses** — Teachers can edit their own previous responses via modal
- **Status Management** — Mark doubts as resolved
- **Dashboard** — Pending review banner with count, teacher-specific stats
- **Resolved Doubts** — Teachers can view all statuses including resolved doubts in the review queue
- **Feed Card Actions** — Quick Approve/Override buttons directly on the dashboard feed
- **Chat with AI** — Teachers can also chat with AI about any doubt's answer for deeper explanations or to verify AI reasoning before approving.

### Shared

- **Auth** — Sign up / Sign in with email and password (Student or Teacher role)
- **Role-based Access** — Teachers see approve/override buttons; students see full AI answers with verification status
- **Responsive Design** — 3-column desktop, 2-column tablet, single-column mobile
- **Dark Theme** — Consistent dark UI with amber accents and custom scrollbar
- **Toast Notifications** — Themed toasts for all actions
- **Route Protection** — Middleware-based auth, public dashboard, protected routes

---

## AI Auto-Approve System

Unapproved AI answers are automatically approved after a configurable time. The system works as follows:

1. AI generates a response → shown to student with warning badge "Unverified — pending teacher approval"
2. Live countdown badge shows time remaining (e.g., "23h 58m")
3. After timer expires → badge changes to "Auto-Approved" (green), border turns green
4. Teacher can still manually approve/disapprove anytime

**Configuration** — Single line in `src/lib/config/ai.ts`:

```ts
// Testing:  2 minutes
AUTO_APPROVE_AFTER_MS: 2 * 60 * 1000,

// Production: 24 hours
AUTO_APPROVE_AFTER_MS: 24 * 60 * 60 * 1000,
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Language** | TypeScript (strict) |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma 7 with `@prisma/adapter-pg` |
| **Auth** | better-auth (email/password, session-based) |
| **AI** | OpenRouter (OpenAI SDK, `openai/gpt-oss-120b:free`) |
| **Background Jobs** | Inngest (serverless event-driven) |
| **State Management** | TanStack React Query (useQuery + useMutation) |
| **UI** | Tailwind CSS 4 + shadcn/ui (base-ui/react) |
| **Markdown** | @uiw/react-md-editor (editor) + react-markdown (renderer) |
| **Icons** | react-icons (hi2) |
| **Toasts** | sonner |
| **Fonts** | JetBrains Mono + Geist Sans |

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/doubt-flow.git
cd doubt-flow

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your actual values (see below)

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed subjects (optional — or add via UI)
npx prisma db seed

# Start Inngest dev server (in a separate terminal)
npm run inngest

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon, Supabase, or local) |
| `BETTER_AUTH_SECRET` | Yes | Random secret for session signing (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Yes | App URL (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Yes | Same as above (must be prefixed with `NEXT_PUBLIC_` for client) |
| `OPENROUTER_API_KEY` | Yes | API key from [openrouter.ai](https://openrouter.ai/settings/keys) |
| `INNGEST_DEV` | Local only | Set to `1` for local development |
| `INNGEST_SIGNING_KEY` | Production | Signing key from [app.inngest.com](https://app.inngest.com/keys) |

See `.env.example` for the full template.

---

## Database Schema

```
User          — id, name, email, password, role (STUDENT/TEACHER), image, emailVerified
Account       — OAuth/credential account (better-auth)
Session       — Session tokens (better-auth)
Verification  — Email verification tokens (better-auth)
Subject       — id, name, description
Doubt         — id, title, body, status (OPEN/UNDER_REVIEW/RESOLVED), difficulty, userId, subjectId
Response      — id, content, source (AI/TEACHER), approved, doubtId, userId
ChatMessage   — id, role (USER/ASSISTANT), content, userId, doubtId, responseId?
```

---

## Project Structure

```
src/
  app/
    (auth)/                — Sign in / Sign up pages
    (root)/
      page.tsx             — Landing page (hero + features)
      (authenticated)/     — Protected routes (layout checks session)
        _authenticated-wrapper.tsx — UserContext provider
        dashboard/         — Main feed + stats + ask a doubt
        dashboard/ask/     — Full-page doubt form
        my-doubts/         — Student's doubts list
        profile/           — User profile (name, password, image)
        doubt/[id]/        — Doubt detail (two-panel layout)
        teacher/review/    — Teacher review queue (two-panel)
    api/
      auth/[...all]/       — better-auth handler
      chat/                — Chat with AI (GET history + POST streaming)
      inngest/             — Inngest serverless handler
  components/
    ui/                    — shadcn components
    _auth-forms.tsx        — Shared sign-in/sign-up form
    header.tsx             — Landing page header
    footer.tsx             — Landing page footer
    markdown-editor.tsx    — Markdown editor wrapper
    markdown-renderer.tsx  — Markdown renderer
    _chat-with-ai-sheet.tsx — Slide-out chat sheet with streaming
  views/
    dashboard/
      _dashboard-view.tsx     — 3-column layout (fixed sidebars, scrollable center)
      _left-sidebar.tsx       — Stats + welcome + quick actions
      _right-sidebar.tsx      — Subject filter
      _doubt-feed.tsx         — Feed with filters + loading states
      _doubt-feed-card.tsx    — Individual doubt card with teacher actions
      _doubt-detail-view.tsx  — Two-panel detail with auto-approve
      _doubt-form.tsx         — Reusable doubt form (used by page + modal)
      _ask-doubt-modal.tsx    — Alt+Q modal
      _ask-doubt-page-view.tsx — Standalone form page
      _edit-doubt-modal.tsx   — Edit doubt modal
      _edit-response-modal.tsx — Edit teacher response modal
      _ai-response-badge.tsx  — Live auto-approve countdown badge
      _subject-filter.tsx     — Subject filter with show more
      _stat-card.tsx          — Reusable stat card
      _dashboard-user-menu.tsx — Desktop user dropdown
      _dashboard-mobile-menu.tsx — Mobile slide-out menu
      _dashboard-data.ts      — Types + dummy data
    teacher/
      _review-view.tsx        — Two-panel review queue
      _teacher-response-form.tsx — Expandable teacher response form
    profile/
      _profile-view.tsx       — Profile with name/password editing
    home/
      _hero.tsx               — Landing hero section
      _features.tsx           — Landing features section
  lib/
    auth.ts                   — better-auth server config
    auth-client.ts            — better-auth React client
    prisma.ts                 — Prisma singleton
    utils.ts                  — Utility functions (cn)
    get-sessions.ts           — Server session helper
    config/
      ai.ts                   — Auto-approve timer config
    providers/
      query-provider.tsx      — TanStack React Query provider
      user-context.tsx        — UserContext for name sync
    actions/
      doubt.ts                — Doubt CRUD + stats
      response.ts             — Teacher response CRUD + review queue
      chat.ts                 — Chat API helpers (send message + load history)
      subject.ts              — Subject fetch
      profile.ts              — Profile update (name, password, image)
    hooks/
      use-doubts.ts           — Doubt queries + mutations
      use-responses.ts        — Response queries + mutations
      use-subjects.ts         — Subject queries
      use-chat.ts             — Chat hook with real-time streaming
  inngest/
    client.ts                 — Inngest client
    functions/
      generate-ai-response.ts — AI generation + failure handler
  proxy.ts                    — Middleware route protection logic
  middleware.ts               — Re-exports proxy
```

---

## How It Works

### Core Flow

```
1. Student posts a doubt
   → Saved to PostgreSQL
   → Inngest event "doubt.created" sent (fire-and-forget, doesn't block)

2. Inngest picks up the event
   → Fetches doubt from DB (idempotency check — won't create duplicate responses)
   → Calls OpenRouter AI (openai/gpt-oss-120b:free)
   → Saves Response with source: AI
   → Updates doubt status to UNDER_REVIEW
   → On failure: error response saved so student isn't stuck forever

3. Detail page polls every 3 seconds
   → Detects new AI response (polls until AI response exists, not just any response)
   → Shows full content with warning badge "Unverified — pending teacher approval"
   → Live countdown until auto-approve timer expires

4. Teacher reviews the AI answer
   → Approve → Response marked approved, doubt RESOLVED, green "Verified" badge
   → Disapprove → Response marked disapproved, student sees "not approved" message
   → Override → Teacher writes their own Response with source: TEACHER

5. Auto-approve (if teacher doesn't review in time)
   → After configurable timer (default 24h), badge changes to "Auto-Approved"
   → Border turns green, warning disappears
   → Teacher can still disapprove after auto-approve
```

### Auto-Approve System

```
Time 0:     AI response created → badge shows "23h 59m" countdown
            Student sees full answer + warning "Unverified"

Time 1min:  Badge updates every second → "23h 58m", "23h 57m"...

Time 24h:   Auto-approve triggers
            Badge → "Auto-Approved" (green)
            Border → green (same as manually approved)
            Warning → disappears
            Feed card → shows "Verified" (next refresh cycle)
```

### Chat with AI

```
1. Student/Teacher clicks "Chat with AI" on a doubt detail page
   → Slide-out sheet opens from the right
   → Chat history loaded from DB (user-specific)

2. User types a question and sends
   → Message appears instantly in the chat
   → API builds prompt with: doubt context + ALL responses + chat history
   → Calls OpenRouter with streaming enabled

3. AI response streams in word by word
   → ReadableStream pipes tokens to the client in real-time
   → User message saved to DB immediately
   → AI response saved after stream completes

4. Chat persists across sessions
   → Each user has their own private chat per doubt
   → History loads from DB on every sheet open
   → AI has full context of all prior messages

Context sent to AI:
- Doubt title, body, subject, difficulty
- ALL responses (AI + Teacher) with source and approval status
- Full chat history for the current user
- Guardrails: stay on-topic, don't contradict teacher answers, admit uncertainty
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import on [vercel.com/new](https://vercel.com/new)
3. Set environment variables in Vercel dashboard (see table above)
4. `postinstall` hook is already in `package.json` (`prisma generate` runs on install)
5. Register your `/api/inngest` URL on [app.inngest.com](https://app.inngest.com)
6. Deploy
7. Set `NEXT_PUBLIC_BETTER_AUTH_URL` to your production URL (e.g., `https://your-app.vercel.app`)

### Vercel Environment Variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | `https://your-app.vercel.app` |
| `OPENROUTER_API_KEY` | Your OpenRouter key |
| `INNGEST_SIGNING_KEY` | From Inngest dashboard → Settings → Keys |

**Important:** Do NOT set `INNGEST_DEV=1` in production. Remove it if present.

---

## License

This project is built as a job assignment for House of Edtech.
