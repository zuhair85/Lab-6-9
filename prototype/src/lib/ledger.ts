type Person = { id: string; name: string; initials: string; color: string };
type Share = { userId: string; amountCents: number };
type Expense = { id: string; groupId: string; payerId: string; amountCents: number; date: Date; description: string; status: string; splitType: string; shares: Share[]; payer: Person };
type Payment = { id: string; groupId: string; payerId: string; payeeId: string; amountCents: number; date: Date; note: string | null; payer: Person; payee: Person };

export function calculateBalances(members: Person[], expenses: Expense[], payments: Payment[]) {
  const position = new Map(members.map((member) => [member.id, 0]));
  for (const expense of expenses.filter((item) => item.status === "APPROVED")) {
    position.set(expense.payerId, (position.get(expense.payerId) ?? 0) + expense.amountCents);
    for (const share of expense.shares) position.set(share.userId, (position.get(share.userId) ?? 0) - share.amountCents);
  }
  for (const payment of payments) {
    position.set(payment.payerId, (position.get(payment.payerId) ?? 0) + payment.amountCents);
    position.set(payment.payeeId, (position.get(payment.payeeId) ?? 0) - payment.amountCents);
  }
  const creditors = [...position].filter(([, cents]) => cents > 0).map(([id, cents]) => ({ id, cents }));
  const debtors = [...position].filter(([, cents]) => cents < 0).map(([id, cents]) => ({ id, cents: -cents }));
  const balances: { from: Person; to: Person; amountCents: number }[] = [];
  for (const debtor of debtors) for (const creditor of creditors) {
    const amountCents = Math.min(debtor.cents, creditor.cents);
    if (amountCents > 0) balances.push({ from: members.find((person) => person.id === debtor.id)!, to: members.find((person) => person.id === creditor.id)!, amountCents });
    debtor.cents -= amountCents;
    creditor.cents -= amountCents;
  }
  return balances;
}

export function splitCents(total: number, participants: { id: string; percentage?: number }[], splitType: "EQUAL" | "PERCENTAGE") {
  if (!Number.isSafeInteger(total) || total < 1) throw new Error("Enter an amount greater than $0.00.");
  if (!participants.length) throw new Error("Choose at least one participant.");
  if (new Set(participants.map((person) => person.id)).size !== participants.length) throw new Error("Each participant can only be selected once.");
  if (splitType === "PERCENTAGE") {
    const totalPercent = participants.reduce((sum, person) => sum + (person.percentage ?? 0), 0);
    if (participants.some((person) => !Number.isFinite(person.percentage) || (person.percentage ?? 0) < 0) || Math.abs(totalPercent - 100) > 0.001) throw new Error("Percentages must add up to exactly 100%.");
    let remaining = total;
    return participants.map((person, index) => {
      const amountCents = index === participants.length - 1 ? remaining : Math.round(total * (person.percentage ?? 0) / 100);
      remaining -= amountCents;
      return { userId: person.id, amountCents, percentage: person.percentage };
    });
  }
  let remaining = total;
  return participants.map((person, index) => {
    const amountCents = index === participants.length - 1 ? remaining : Math.round(total / participants.length);
    remaining -= amountCents;
    return { userId: person.id, amountCents };
  });
}

export function centsFromAmount(value: unknown) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) throw new Error("Enter a valid amount between $0.01 and $1,000,000.");
  return Math.round(amount * 100);
}
