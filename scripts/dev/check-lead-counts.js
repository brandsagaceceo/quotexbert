const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const total = await prisma.lead.count();
  const seeded = await prisma.lead.count({ where: { isSeeded: true } });
  const real = await prisma.lead.count({ where: { isSeeded: false } });
  const prodVisible = await prisma.lead.count({ where: { isSeeded: false, status: 'open', published: true } });
  console.log('Total leads in DB:', total);
  console.log('Seeded/demo leads (hidden from production):', seeded);
  console.log('Real leads:', real);
  console.log('Currently visible on production job board:', prodVisible);
  await prisma.$disconnect();
}
check().catch(e => { console.error(e); process.exit(1); });
