// TEMPORARY: Fix users with null clerkUserId where id starts with "user_"
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const nullClerkRealUsers = await p.user.findMany({
    where: { clerkUserId: null, id: { startsWith: 'user_' } },
    select: { id: true, email: true },
  });
  console.log(`Found ${nullClerkRealUsers.length} users with null clerkUserId and user_ prefix`);
  for (const u of nullClerkRealUsers) {
    await p.user.update({ where: { id: u.id }, data: { clerkUserId: u.id } });
    console.log(`Fixed: ${u.id} (${u.email})`);
  }
}

main().catch(console.error).finally(() => p.$disconnect());
