import { PrismaClient, HubSubscriptionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
