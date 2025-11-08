const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearUsers() {
  try {
    const result = await prisma.user.deleteMany({});
    console.log('Deleted', result.count, 'users');
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

clearUsers();
