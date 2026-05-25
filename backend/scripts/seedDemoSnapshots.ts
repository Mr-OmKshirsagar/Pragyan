import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seeding demo user and decision snapshots...');

  const user = await prisma.user.upsert({
    where: { email: 'dev.demo@local' },
    update: {},
    create: {
      email: 'dev.demo@local',
      fullName: 'Dev Demo',
      password: 'devpass',
      skills: [],
      interests: [],
      preferences: [],
      xp: 0,
      streak: 0,
    },
  });

  const now = Date.now();
  const tops = [
    ['AI Engineer', 'Data Scientist', 'ML Researcher'],
    ['Data Scientist', 'AI Engineer', 'Product Manager'],
    ['AI Engineer', 'ML Researcher', 'Product Manager'],
  ];

  for (let i = 0; i < tops.length; i++) {
    const createdAt = new Date(now - (tops.length - i) * 60 * 1000); // spaced by 1 minute
    const snapshot = {
      evaluated: tops[i].map((t, idx) => ({ subject: t, score: Math.round(0.9 * 100) - idx * 5 })),
      meta: { seeded: true, index: i },
    };

    const rec = await prisma.decisionSnapshot.create({
      data: {
        userId: user.id,
        snapshot,
        topItems: tops[i],
        meta: { seeded: true },
        createdAt,
      },
    });
    console.log('Created snapshot', rec.id);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
