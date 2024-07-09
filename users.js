const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getUsersAndReferrals() {
  try {
    // Query users
    const users = await prisma.user.findMany({
      include: {
        referrals: true, // Include referrals for each user
        referredBy: true, // Include referrer information for each user
      },
    });

    console.log(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getUsersAndReferrals();
