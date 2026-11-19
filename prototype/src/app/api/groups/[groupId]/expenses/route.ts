import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ groupId: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const { groupId: rawGroupId } = await params;
  const groupId = Number(rawGroupId);
  if (!Number.isSafeInteger(groupId) || groupId < 1) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  let body: {
    description?: unknown;
    amount?: unknown;
    payerId?: unknown;
    participantIds?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter valid expense details." }, { status: 400 });
  }

  const description = typeof body.description === "string" ? body.description.trim() : "";
  const amountText = typeof body.amount === "string" ? body.amount.trim() : "";
  const amountMatch = /^(\d+)(?:\.(\d{1,2}))?$/.exec(amountText);
  const amountCents = amountMatch
    ? Number(amountMatch[1]) * 100 + Number((amountMatch[2] ?? "").padEnd(2, "0"))
    : 0;
  const payerId = Number(body.payerId);
  const participantIds = Array.isArray(body.participantIds)
    ? body.participantIds.map(Number)
    : [];

  if (!description || description.length > 120) {
    return NextResponse.json({ error: "Descriptions must be 1 to 120 characters." }, { status: 400 });
  }
  if (!amountMatch || !Number.isSafeInteger(amountCents) || amountCents <= 0) {
    return NextResponse.json({ error: "Amount must be greater than $0.00 with at most two decimal places." }, { status: 400 });
  }
  if (!Number.isSafeInteger(payerId) || payerId < 1) {
    return NextResponse.json({ error: "Choose a valid payer from this group." }, { status: 400 });
  }
  if (
    participantIds.length === 0 ||
    participantIds.some((id) => !Number.isSafeInteger(id) || id < 1) ||
    new Set(participantIds).size !== participantIds.length
  ) {
    return NextResponse.json({ error: "Select at least one valid participant." }, { status: 400 });
  }

  const members = await prisma.splitMember.findMany({
    where: { groupId, id: { in: [...new Set([...participantIds, payerId])] } },
    select: { id: true },
  });
  const memberIds = new Set(members.map((member) => member.id));
  if (!memberIds.has(payerId) || participantIds.some((id) => !memberIds.has(id))) {
    return NextResponse.json({ error: "Payer and participants must belong to this group." }, { status: 400 });
  }

  const sortedParticipantIds = [...participantIds].sort((a, b) => a - b);
  const baseShare = Math.floor(amountCents / sortedParticipantIds.length);
  const remainder = amountCents % sortedParticipantIds.length;
  const shares = sortedParticipantIds.map((memberId, index) => ({
    memberId,
    amountCents: baseShare + (index < remainder ? 1 : 0),
  }));

  const expense = await prisma.splitExpense.create({
    data: {
      groupId,
      payerId,
      description,
      amountCents,
      shares: { create: shares },
    },
    include: {
      payer: true,
      shares: { include: { member: true }, orderBy: { memberId: "asc" } },
    },
  });

  return NextResponse.json(expense, { status: 201 });
}