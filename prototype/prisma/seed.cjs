/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const people = [
    ['alex', 'Alex Morgan', 'alex@splitsmart.demo', 'AM', 'mint'],
    ['jordan', 'Jordan Lee', 'jordan@splitsmart.demo', 'JL', 'lavender'],
    ['sam', 'Sam Rivera', 'sam@splitsmart.demo', 'SR', 'peach'],
    ['taylor', 'Taylor Kim', 'taylor@splitsmart.demo', 'TK', 'blue'],
  ];
  for (const [id, name, email, initials, color] of people) {
    await prisma.user.upsert({ where: { email }, update: { name, initials, color }, create: { id, name, email, initials, color } });
  }
  const users = Object.fromEntries(await Promise.all(people.map(async ([id, , email]) => [id, await prisma.user.findUniqueOrThrow({ where: { email } })])));
  const groupRows = [
    { id: 'weekend-house', name: 'The Sunday Place', emoji: '🏡', accent: 'mint' },
    { id: 'coast-trip', name: 'Big Sur weekend', emoji: '🌊', accent: 'lavender' },
    { id: 'dinner-club', name: 'Dinner club', emoji: '🍝', accent: 'peach' },
  ];
  for (const data of groupRows) {
    const group = await prisma.group.upsert({ where: { id: data.id }, update: data, create: data });
    const memberIds = data.id === 'dinner-club' ? ['alex', 'sam', 'taylor'] : ['alex', 'jordan', 'sam', 'taylor'];
    for (const key of memberIds) await prisma.membership.upsert({ where: { userId_groupId: { userId: users[key].id, groupId: group.id } }, update: {}, create: { userId: users[key].id, groupId: group.id } });
  }
  const examples = [
    ['seed-groceries', 'weekend-house', 'alex', 'Weekly groceries', 8640, '2026-11-16', 'EQUAL', 'APPROVED', [['alex',2160],['jordan',2160],['sam',2160],['taylor',2160]]],
    ['seed-internet', 'weekend-house', 'jordan', 'Wi-Fi · November', 7200, '2026-11-14', 'EQUAL', 'APPROVED', [['alex',1800],['jordan',1800],['sam',1800],['taylor',1800]]],
    ['seed-plants', 'weekend-house', 'sam', 'A few new plants', 3850, '2026-11-12', 'EQUAL', 'PENDING', [['alex',963],['jordan',962],['sam',963],['taylor',962]]],
    ['seed-cabin', 'coast-trip', 'taylor', 'Cabin deposit', 48000, '2026-11-10', 'EQUAL', 'APPROVED', [['alex',12000],['jordan',12000],['sam',12000],['taylor',12000]]],
    ['seed-dinner', 'dinner-club', 'alex', 'Dinner at Bar Part Time', 15600, '2026-11-08', 'PERCENTAGE', 'APPROVED', [['alex',5200],['sam',5200],['taylor',5200]]],
    ['seed-market', 'weekend-house', 'taylor', 'Farmers market', 5230, '2026-11-17', 'EQUAL', 'APPROVED', [['alex',1308],['jordan',1307],['sam',1308],['taylor',1307]]],
  ];
  for (const [id, groupId, payer, description, amountCents, date, splitType, status, shares] of examples) {
    await prisma.expense.upsert({ where: { id }, update: {}, create: { id, groupId, payerId: users[payer].id, description, amountCents, date: new Date(`${date}T12:00:00.000Z`), splitType, status, shares: { create: shares.map(([key, cents]) => ({ userId: users[key].id, amountCents: cents })) } } });
  }
  await prisma.payment.upsert({ where: { id: 'seed-payment' }, update: {}, create: { id: 'seed-payment', groupId: 'weekend-house', payerId: users.sam.id, payeeId: users.alex.id, amountCents: 2400, date: new Date('2026-11-15T12:00:00.000Z'), note: 'Settled up for utilities' } });
}

main().finally(() => prisma.$disconnect());
