import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const groups = await prisma.splitGroup.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { members: true, expenses: true } } },
  });

  return NextResponse.json(groups);
}

export async function POST(request: Request) {
  let body: { name?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter a valid group name." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name || name.length > 60) {
    return NextResponse.json({ error: "Group names must be 1 to 60 characters." }, { status: 400 });
  }

  const group = await prisma.splitGroup.create({ data: { name } });
  return NextResponse.json(group, { status: 201 });
}