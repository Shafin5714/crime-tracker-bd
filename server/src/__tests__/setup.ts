import { prisma } from "../utils/prisma";

// Clean up database after all tests
afterAll(async () => {
  // Delete all test data
  await prisma.crimeValidation.deleteMany();
  await prisma.crimeReport.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
