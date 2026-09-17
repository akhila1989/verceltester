// In-memory data store for the task tracker.
//
// NOTE: This is intentionally simple for learning purposes. Data lives only
// in the memory of the running server process, so it:
//   - resets whenever the app redeploys or a serverless function cold-starts
//   - is NOT shared reliably across concurrent serverless invocations on Vercel
//
// This is fine for getting reps with Next.js + Vercel. When you're ready for
// data that actually persists, swap this file for a real database (Vercel
// Postgres, Supabase, Neon, Turso, etc.) — the API routes that call this
// module wouldn't need to change shape, just what's inside them.

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: number;
}

// A global cache so hot-reload in dev doesn't wipe the list on every edit.
const globalForStore = globalThis as unknown as { __tasks?: Task[] };

function seed(): Task[] {
  const now = Date.now();
  return [
    {
      id: crypto.randomUUID(),
      title: "Push this repo to GitHub",
      done: false,
      priority: "high",
      createdAt: now - 3000,
    },
    {
      id: crypto.randomUUID(),
      title: "Connect the repo on Vercel",
      done: false,
      priority: "high",
      createdAt: now - 2000,
    },
    {
      id: crypto.randomUUID(),
      title: "Try editing this task list",
      done: false,
      priority: "medium",
      createdAt: now - 1000,
    },
  ];
}

if (!globalForStore.__tasks) {
  globalForStore.__tasks = seed();
}

export function getTasks(): Task[] {
  return [...globalForStore.__tasks!].sort((a, b) => b.createdAt - a.createdAt);
}

export function getTask(id: string): Task | undefined {
  return globalForStore.__tasks!.find((t) => t.id === id);
}

export function createTask(input: { title: string; priority?: Priority }): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    done: false,
    priority: input.priority ?? "medium",
    createdAt: Date.now(),
  };
  globalForStore.__tasks!.push(task);
  return task;
}

export function updateTask(
  id: string,
  patch: Partial<Pick<Task, "title" | "done" | "priority">>
): Task | undefined {
  const task = globalForStore.__tasks!.find((t) => t.id === id);
  if (!task) return undefined;
  if (patch.title !== undefined) task.title = patch.title.trim();
  if (patch.done !== undefined) task.done = patch.done;
  if (patch.priority !== undefined) task.priority = patch.priority;
  return task;
}

export function deleteTask(id: string): boolean {
  const before = globalForStore.__tasks!.length;
  globalForStore.__tasks = globalForStore.__tasks!.filter((t) => t.id !== id);
  return globalForStore.__tasks.length < before;
}
