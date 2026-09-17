import TaskBoard from "./components/TaskBoard";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Task Tracker</h1>
        <p className="mt-2 text-sm text-muted">
          A minimal full-stack CRUD app: Next.js App Router, API routes, and a
          server-side store — built to be deployed on Vercel.
        </p>
      </header>
      <TaskBoard />
    </main>
  );
}
