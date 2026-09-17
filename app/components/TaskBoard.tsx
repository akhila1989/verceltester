"use client";

import { useEffect, useState } from "react";

type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: number;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-slate-700 text-slate-200",
  medium: "bg-amber-500/20 text-amber-300",
  high: "bg-rose-500/20 text-rose-300",
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to create task");
      }
      setTitle("");
      setPriority("medium");
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleDone(task: Task) {
    setTasks(
      (prev) =>
        prev?.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)) ??
        prev
    );
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    });
    if (!res.ok) await loadTasks(); // revert on failure
  }

  async function handleDelete(id: string) {
    setTasks((prev) => prev?.filter((t) => t.id !== id) ?? prev);
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) await loadTasks();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accentHover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add task
        </button>
      </form>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      {tasks === null ? (
        <p className="text-sm text-muted">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-muted">No tasks yet — add one above.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleDone(task)}
                className="h-4 w-4 shrink-0 accent-accent"
              />
              <span
                className={`flex-1 text-sm ${
                  task.done ? "text-muted line-through" : "text-slate-100"
                }`}
              >
                {task.title}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
              >
                {task.priority}
              </span>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-xs text-muted transition hover:text-rose-400"
                aria-label="Delete task"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
