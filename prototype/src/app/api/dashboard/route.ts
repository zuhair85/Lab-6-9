import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateBalances, centsFromAmount, splitCents } from "@/lib/ledger";

const DEMO_USER_EMAIL = "alex@splitsmart.demo";
const fail = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

export async function GET(request: NextRequest) {
  try {
    const me = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
    if (!me) return fail("Demo data is not set up yet. Run the database seed command.", 503);
    const [users, groups, expenses, payments] = await Promise.all([
      prisma.user.findMany({ orderBy: { name: "asc" } }),
      prisma.group.findMany({ include: { memberships: { include: { user: true } } }, orderBy: { createdAt: "asc" } }),
      prisma.expense.findMany({ include: { payer: true, shares: { include: { user: true } }, group: true }, orderBy: { date: "desc" } }),
      prisma.payment.findMany({ include: { payer: true, payee: true, group: true }, orderBy: { date: "desc" } }),
    ]);
    const groupsWithBalances = groups.map((group) => {
      const members = group.memberships.map((membership) => membership.user);
      const groupExpenses = expenses.filter((expense) => expense.groupId === group.id);
      const groupPayments = payments.filter((payment) => payment.groupId === group.id);
      const balances = calculateBalances(members, groupExpenses, groupPayments);
      const myOwed = balances.filter((item) => item.to.id === me.id).reduce((sum, item) => sum + item.amountCents, 0);
      const myOwing = balances.filter((item) => item.from.id === me.id).reduce((sum, item) => sum + item.amountCents, 0);
      return { id: group.id, name: group.name, emoji: group.emoji, accent: group.accent, members, balances, myOwed, myOwing, expenses: groupExpenses, payments: groupPayments };
    });
    const startValue = request.nextUrl.searchParams.get("start");
    const endValue = request.nextUrl.searchParams.get("end");
    const start = startValue ? new Date(`${startValue}T00:00:00.000Z`) : null;
    const end = endValue ? new Date(`${endValue}T23:59:59.999Z`) : null;
    const inRange = (date: Date) => (!start || date >= start) && (!end || date <= end);
    const reportExpenses = expenses.filter((item) => item.status === "APPROVED" && inRange(item.date));
    const reportPayments = payments.filter((item) => inRange(item.date));
    const activities = [...expenses.map((item) => ({ id: item.id, kind: "expense", description: item.description, amountCents: item.amountCents, date: item.date, groupName: item.group.name, groupEmoji: item.group.emoji, person: item.payer, status: item.status })), ...payments.map((item) => ({ id: item.id, kind: "payment", description: item.note || "Payment", amountCents: item.amountCents, date: item.date, groupName: item.group.name, groupEmoji: item.group.emoji, person: item.payer, status: "APPROVED" }))].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 10);
    return NextResponse.json({ me, users, groups: groupsWithBalances, activities, pending: expenses.filter((item) => item.status === "PENDING"), report: { expenses: reportExpenses, payments: reportPayments, totalExpensesCents: reportExpenses.reduce((sum, item) => sum + item.amountCents, 0), totalPaymentsCents: reportPayments.reduce((sum, item) => sum + item.amountCents, 0), count: reportExpenses.length } });
  } catch (error) {
    console.error(error);
    return fail("Could not load your SplitSmart data. Please refresh and try again.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === "expense") {
      const amountCents = centsFromAmount(body.amount);
      const date = new Date(`${body.date}T12:00:00.000Z`);
      if (!body.description?.trim() || body.description.trim().length > 80) return fail("Add a description of up to 80 characters.");
      if (!Number.isFinite(+date)) return fail("Choose a valid expense date.");
      const group = await prisma.group.findUnique({ where: { id: body.groupId }, include: { memberships: true } });
      if (!group) return fail("Choose a group from the list.");
      const memberIds = new Set(group.memberships.map((item) => item.userId));
      if (!memberIds.has(body.payerId)) return fail("The payer must be a member of this group.");
      const participants = Array.isArray(body.participants) ? body.participants : [];
      if (participants.some((person: { id: string }) => !memberIds.has(person.id))) return fail("Every participant must belong to the selected group.");
      const shares = splitCents(amountCents, participants, body.splitType === "PERCENTAGE" ? "PERCENTAGE" : "EQUAL");
      const expense = await prisma.expense.create({ data: { groupId: group.id, payerId: body.payerId, description: body.description.trim(), amountCents, date, splitType: body.splitType === "PERCENTAGE" ? "PERCENTAGE" : "EQUAL", status: "PENDING", shares: { create: shares } } });
      return NextResponse.json({ expense }, { status: 201 });
    }
    if (body.action === "review") {
      if (!["APPROVED", "REJECTED"].includes(body.status)) return fail("Choose approve or reject.");
      const result = await prisma.expense.updateMany({ where: { id: body.expenseId, status: "PENDING" }, data: { status: body.status } });
      if (!result.count) return fail("This expense has already been reviewed.", 409);
      return NextResponse.json({ ok: true });
    }
    if (body.action === "payment") {
      const amountCents = centsFromAmount(body.amount);
      const [group, payer, payee] = await Promise.all([prisma.group.findUnique({ where: { id: body.groupId }, include: { memberships: true } }), prisma.user.findUnique({ where: { id: body.payerId } }), prisma.user.findUnique({ where: { id: body.payeeId } })]);
      if (!group || !payer || !payee || payer.id === payee.id) return fail("Choose two different group members for this payment.");
      const memberIds = new Set(group.memberships.map((item) => item.userId));
      if (!memberIds.has(payer.id) || !memberIds.has(payee.id)) return fail("Both people must belong to this group.");
      await prisma.payment.create({ data: { groupId: group.id, payerId: payer.id, payeeId: payee.id, amountCents, date: new Date(`${body.date}T12:00:00.000Z`), note: body.note?.trim() || null } });
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    return fail("Choose a valid action.");
  } catch (error) {
    if (error instanceof Error && !error.message.includes("Prisma")) return fail(error.message);
    console.error(error);
    return fail("We couldn’t save that just now. Please try again.", 500);
  }
}
