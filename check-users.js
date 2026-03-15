const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.user.count();
  const contractors = await p.contractorProfile.count();
  const homeowners = await p.homeownerProfile.count();
  console.log('=== DATABASE USER COUNTS ===');
  console.log('Total Users:', users);
  console.log('Contractor Profiles:', contractors);
  console.log('Homeowner Profiles:', homeowners);
  
  const recentUsers = await p.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { email: true, name: true, role: true, createdAt: true }
  });
  console.log('\n=== MOST RECENT USERS ===');
  recentUsers.forEach(u => console.log(`${u.createdAt.toISOString().split('T')[0]} | ${u.role} | ${u.name} | ${u.email}`));
}

main().catch(console.error).finally(() => p.$disconnect());
