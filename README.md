# Task Tracker

A tiny full-stack CRUD app for getting reps with Next.js and Vercel:

- **Frontend:** Next.js App Router + React, styled with Tailwind CSS
- **Backend:** Next.js Route Handlers (`app/api/tasks`) — GET, POST, PATCH, DELETE
- **Data:** an in-memory store (`lib/store.ts`) — no database setup required to start

> **Heads up on persistence:** the store keeps tasks in server memory. That's
> great for learning the CRUD flow with zero setup, but it means data resets
> on redeploys/cold starts and isn't reliably shared across concurrent
> serverless invocations on Vercel. Once this feels comfortable, swapping in
> a real database (Vercel Postgres, Supabase, Neon, Turso...) behind the same
> `lib/store.ts` functions is a natural "next rep."

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Push to GitHub

```bash
cd task-tracker
git init
git add .
git commit -m "Initial commit: task tracker"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Create the empty repo on GitHub first, then paste its URL into the `remote add` command above.)

## Deploy to Vercel

1. Go to https://vercel.com/new and sign in (GitHub login is easiest).
2. Click **Import** next to the repo you just pushed.
3. Framework preset should auto-detect as **Next.js** — leave the build
   settings as default.
4. Click **Deploy**. Vercel installs dependencies and builds the app for you.
5. You'll get a live `*.vercel.app` URL when it finishes (usually well under
   a minute for a project this size).

Every future `git push` to `main` triggers a new deployment automatically,
and pushes to other branches get their own preview URLs — that's the main
"rep" worth practicing: push → watch it build → check the live URL.

## Project structure

```
app/
  api/tasks/route.ts        GET (list) / POST (create)
  api/tasks/[id]/route.ts   GET / PATCH (update) / DELETE
  components/TaskBoard.tsx  client component: the UI + fetch calls
  layout.tsx, page.tsx      app shell
lib/store.ts                the in-memory "database"
```

## Note on this build

This project's files were written by hand rather than scaffolded with
`create-next-app` / `npm install`, because the sandbox this was built in had
no access to the npm registry — so `npm install` and `npm run build` haven't
been run or verified here. The code follows standard, current Next.js 14
App Router conventions, but do run `npm install && npm run build` yourself
after downloading to confirm it builds clean before you push.
