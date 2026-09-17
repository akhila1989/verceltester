import { NextRequest, NextResponse } from "next/server";
import { deleteTask, getTask, updateTask, Priority } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const task = getTask(params.id);
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const patch: { title?: string; done?: boolean; priority?: Priority } = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "'title' must be a non-empty string." }, { status: 400 });
    }
    patch.title = body.title;
  }

  if (body.done !== undefined) {
    if (typeof body.done !== "boolean") {
      return NextResponse.json({ error: "'done' must be a boolean." }, { status: 400 });
    }
    patch.done = body.done;
  }

  if (body.priority !== undefined) {
    if (body.priority !== "low" && body.priority !== "medium" && body.priority !== "high") {
      return NextResponse.json({ error: "'priority' must be low, medium, or high." }, { status: 400 });
    }
    patch.priority = body.priority;
  }

  const task = updateTask(params.id, patch);
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const ok = deleteTask(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
