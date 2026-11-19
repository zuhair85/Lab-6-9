import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ groupId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { groupId: rawGroupId } = await params;
  const groupId = Number(rawGroupId);
  if (!Number.isSafeInteger(groupId) || groupId < 1) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  const group = await prisma.splitGroup.findUnique({
    where: { id: groupId },
    include: {
      members: { orderBy: { name: "asc" } },
      expenses: {
        orderBy: { createdAt: "desc" },
        include: {
          payer: true,
          shares: { include: { member: true }, orderBy: { memberId: "asc" } },
        },
      },
    },
  });

  if (!group) return NextResponse.json({ error: "Group not found." }, { status: 404 });
  return NextResponse.json(group);
}