const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const email = process.argv[2] || 'test@example.com';
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`User not found for email: ${email}`);
    } else {
      console.log('User found:');
      console.log(JSON.stringify(user, null, 2));
    }
  } catch (err) {
    console.error('Error querying user:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
