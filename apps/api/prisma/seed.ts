import { PrismaClient, HubSubscriptionType, OnboardingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SEED_USER_EMAIL = process.env.SEED_USER_EMAIL || 'iamustapha213@gmail.com';
const SEED_USER_PASSWORD = process.env.SEED_USER_PASSWORD || 'Password123!';
const SEED_USER_LOGIN_PIN = process.env.SEED_USER_LOGIN_PIN || '123456';
const SEED_USER_PAYMENT_PIN = process.env.SEED_USER_PAYMENT_PIN || '1234';

async function seedTestUser() {
  console.log('Seeding test user...');

  const existing = await prisma.user.findUnique({ where: { email: SEED_USER_EMAIL } });
  if (existing) {
    console.log(`Test user ${SEED_USER_EMAIL} already exists`);
    return;
  }

  const [passwordHash, loginPinHash, paymentPinHash] = await Promise.all([
    bcrypt.hash(SEED_USER_PASSWORD, 10),
    bcrypt.hash(SEED_USER_LOGIN_PIN, 10),
    bcrypt.hash(SEED_USER_PAYMENT_PIN, 10),
  ]);

  const user = await prisma.user.create({
    data: {
      email: SEED_USER_EMAIL,
      phone: '+2348000000000',
      fullName: 'Test User',
      authProvider: 'local',
      onboardingStatus: OnboardingStatus.complete,
    },
  });

  await prisma.auth.create({
    data: {
      userId: user.id,
      passwordHash,
      passwordSetAt: new Date(),
      loginPinHash,
      loginPinSetAt: new Date(),
      paymentPinHash,
      paymentPinSetAt: new Date(),
      phoneVerifiedAt: new Date(),
      lastPinChangedAt: new Date(),
    },
  });

  await prisma.wallet.create({
    data: {
      userId: user.id,
      availableCredits: 0.0,
      escrowedCredits: 0.0,
    },
  });

  console.log(`Created test user ${SEED_USER_EMAIL}`);
  console.log(`  Login PIN: ${SEED_USER_LOGIN_PIN}`);
  console.log(`  Payment PIN: ${SEED_USER_PAYMENT_PIN}`);
  console.log(`  Password: ${SEED_USER_PASSWORD}`);
}

async function main() {
  await seedTestUser();

  console.log('Seeding subscription tiers...');

  const tiers = [
    {
      type: HubSubscriptionType.Daily,
      name: 'Daily Subscription',
      creditCost: 10,
      studentCreditCost: 8,
      validityDays: 1,
      isActive: true,
    },
    {
      type: HubSubscriptionType.Weekly,
      name: 'Weekly Subscription',
      creditCost: 50,
      studentCreditCost: 40,
      validityDays: 7,
      isActive: true,
    },
    {
      type: HubSubscriptionType.Monthly,
      name: 'Monthly Subscription',
      creditCost: 180,
      studentCreditCost: 144,
      validityDays: 30,
      isActive: true,
    },
  ];

  for (const tier of tiers) {
    const existing = await prisma.subscription.findFirst({
      where: { type: tier.type },
    });

    if (!existing) {
      await prisma.subscription.create({
        data: tier,
      });
      console.log(`Created subscription tier: ${tier.name}`);
    } else {
      console.log(`Subscription tier ${tier.name} already exists`);
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
