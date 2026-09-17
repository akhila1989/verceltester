import { NextRequest, NextResponse } from "next/server";
import { createTask, getTasks, Priority } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getTasks());
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json(
      { error: "A non-empty 'title' string is required." },
      { status: 400 }
    );
  }

  const priority: Priority | undefined =
    body.priority === "low" || body.priority === "medium" || body.priority === "high"
      ? body.priority
      : undefined;

  const task = createTask({ title: body.title, priority });
  return NextResponse.json(task, { status: 201 });
}
