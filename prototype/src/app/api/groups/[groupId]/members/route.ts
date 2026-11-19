import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ groupId: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const { groupId: rawGroupId } = await params;
  const groupId = Number(rawGroupId);
  if (!Number.isSafeInteger(groupId) || groupId < 1) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  let body: { name?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter a valid member name." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name || name.length > 60) {
    return NextResponse.json({ error: "Member names must be 1 to 60 characters." }, { status: 400 });
  }
  if (!(await prisma.splitGroup.findUnique({ where: { id: groupId }, select: { id: true } }))) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  try {
    const member = await prisma.splitMember.create({ data: { groupId, name } });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That member is already in this group." }, { status: 409 });
    }
    throw error;
  }
}