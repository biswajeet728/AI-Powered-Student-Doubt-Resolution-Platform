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
- **AI Answers** — Instant AI-generated responses via OpenRouter (Llama 3.1)
- **Real-time Updates** — Loading indicator while AI generates, live polling for responses
- **Markdown Support** — Full markdown editor for descriptions, rendered beautifully in responses
- **My Doubts** — View, filter (All/Open/Under Review/Resolved), edit, and delete your doubts
- **Profile** — View stats, edit name, change password
- **Dashboard** — Stats overview, recent doubts feed, subject filtering, keyboard shortcut (Alt+Q) to post
- **AI Preview** — Unapproved AI answers shown as blurred preview until teacher verifies

### Teacher

- **Review Queue** — Dedicated page with two-panel layout (doubt list + detail with responses)
- **Approve / Disapprove** — Verify or reject AI-generated answers
- **Override** — Write your own response when AI answer is insufficient
- **Teacher Response** — Post authoritative answers to any doubt
- **Edit Own Responses** — Teachers can edit their own previous responses
- **Status Management** — Mark doubts as resolved
- **Dashboard** — Pending review banner, teacher-specific stats

### Shared

- **Auth** — Sign up / Sign in with email and password (Student or Teacher role)
- **Role-based Access** — Teachers see approve/override buttons, students see blurred AI previews
- **Responsive Design** — 3-column desktop, 2-column tablet, single-column mobile
- **Dark Theme** — Consistent dark UI with amber accents
- **Toast Notifications** — Themed toasts for all actions
- **Route Protection** — Middleware-based auth, public dashboard, protected profile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Language** | TypeScript (strict) |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma 7 with `@prisma/adapter-pg` |
| **Auth** | better-auth (email/password, session-based) |
| **AI** | OpenRouter (OpenAI-compatible API, Llama 3.1 8B) |
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
npx inngest-cli@latest dev

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
User          — id, name, email, password, role (STUDENT/TEACHER), image
Account       — OAuth/credential account (better-auth)
Session       — Session tokens (better-auth)
Verification  — Email verification tokens (better-auth)
Subject       — id, name, description
Doubt         — id, title, body, status (OPEN/UNDER_REVIEW/RESOLVED), difficulty, userId, subjectId
Response      — id, content, source (AI/TEACHER), approved, doubtId, userId
```

---

## Project Structure

```
src/
  app/
    (auth)/              — Sign in / Sign up pages
    (root)/
      page.tsx           — Landing page
      (authenticated)/   — Protected routes (layout checks session)
        dashboard/       — Main feed + stats + ask a doubt
        dashboard/ask/   — Full-page doubt form
        my-doubts/       — Student's doubts list
        profile/         — User profile
        doubt/[id]/      — Doubt detail (two-panel)
        teacher/review/  — Teacher review queue
    api/
      auth/[...all]/     — better-auth handler
      inngest/           — Inngest serverless handler
  components/
    ui/                  — shadcn components
    _auth-forms.tsx      — Shared sign-in/sign-up form
    header.tsx           — Landing page header
    footer.tsx           — Landing page footer
    markdown-editor.tsx  — Markdown editor wrapper
    markdown-renderer.tsx — Markdown renderer
  views/
    dashboard/           — Dashboard components (feed, sidebar, cards, forms, modals)
    teacher/             — Teacher components (review queue, response form)
    profile/             — Profile view
    home/                — Landing page sections
  lib/
    auth.ts              — better-auth server config
    auth-client.ts       — better-auth React client
    prisma.ts            — Prisma singleton
    utils.ts             — Utility functions
    get-sessions.ts      — Server session helper
    providers/           — QueryProvider, UserProvider
    actions/             — Server actions (doubt, response, subject, profile)
    hooks/               — React Query hooks (use-doubts, use-responses, use-subjects)
  inngest/
    client.ts            — Inngest client
    functions/           — AI response generation + failure handler
```

---

## How It Works

```
1. Student posts a doubt
   → Saved to PostgreSQL
   → Inngest event "doubt.created" sent (fire-and-forget)

2. Inngest picks up the event
   → Calls OpenRouter AI (Llama 3.1 8B)
   → Saves Response with source: AI
   → Updates doubt status to UNDER_REVIEW

3. Detail page polls every 3 seconds
   → Detects new AI response
   → Shows it to the student (blurred if unapproved)
   → Shows it to the teacher with Approve/Disapprove buttons

4. Teacher reviews the AI answer
   → Approve → Response marked approved, doubt RESOLVED
   → Disapprove → Response marked disapproved, teacher writes own answer
   → Override → Teacher writes their own Response with source: TEACHER
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import on [vercel.com/new](https://vercel.com/new)
3. Set environment variables in Vercel dashboard
4. Add `postinstall` hook to `package.json` (already included)
5. Register your `/api/inngest` URL on [app.inngest.com](https://app.inngest.com)
6. Deploy

---

## License

This project is built as a job assignment for House of Edtech.
