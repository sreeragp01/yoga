import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Prāṇa Yoga database...');

  // Create Ananya Sharma teacher user
  const teacherUser = await prisma.user.upsert({
    where: { email: 'ananya.sharma@pranayoga.com' },
    update: {},
    create: {
      name: 'Ananya Sharma',
      email: 'ananya.sharma@pranayoga.com',
      phone: '+91 98765 00001',
      role: 'TEACHER',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=400',
      teacherProfile: {
        create: {
          bio: 'Senior Yoga Acharya with 12+ years teaching Ashtanga & Classical Hatha Yoga.',
          styles: ['Hatha', 'Vinyasa', 'Pranayama', 'Restorative'],
          languages: ['English', 'Hindi', 'Sanskrit'],
          timezone: 'Asia/Kolkata',
          isApproved: true,
        },
      },
    },
  });

  // Create Class Types
  const classType = await prisma.classType.create({
    data: {
      teacherId: teacherUser.id,
      name: 'Hatha and Vinyasa Flow',
      description: 'Dynamic alignment, mindful transitions, and therapeutic breathwork.',
      durationMinutes: 60,
      capacity: 1,
      pricePaise: 120000, // ₹1,200
      mode: 'IN_PERSON',
      locationOrLink: 'Prāṇa Sanctuary, Studio A',
    },
  });

  console.log(`✔ Created Teacher: ${teacherUser.name} (${teacherUser.id})`);
  console.log(`✔ Created Class: ${classType.name} (${classType.id})`);
  console.log('🌿 Database seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
