import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

const seedUsers: SeedUser[] = [
  {
    email: "superadmin@crimetracker.bd",
    password: "SuperAdmin@123",
    name: "Super Admin",
    role: UserRole.SUPER_ADMIN,
  },
  {
    email: "admin@crimetracker.bd",
    password: "Admin@123",
    name: "Admin User",
    role: UserRole.ADMIN,
  },
  {
    email: "moderator@crimetracker.bd",
    password: "Moderator@123",
    name: "Moderator User",
    role: UserRole.MODERATOR,
  },
  {
    email: "user@crimetracker.bd",
    password: "User@123",
    name: "Regular User",
    role: UserRole.USER,
  },
];

async function main() {
  console.log("🌱 Starting database seeding...\n");

  for (const userData of seedUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`⏭️  User ${userData.email} already exists, skipping...`);
      continue;
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
        name: userData.name,
        role: userData.role,
        isVerified: true,
      },
    });

    console.log(`✅ Created ${user.role} user: ${user.email}`);
  }

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📋 Seeded Users:");
  console.log("┌────────────────────────────────────┬──────────────────┬─────────────┐");
  console.log("│ Email                              │ Password         │ Role        │");
  console.log("├────────────────────────────────────┼──────────────────┼─────────────┤");
  for (const user of seedUsers) {
    const email = user.email.padEnd(34);
    const password = user.password.padEnd(16);
    const role = user.role.padEnd(11);
    console.log(`│ ${email} │ ${password} │ ${role} │`);
  }
  console.log("└────────────────────────────────────┴──────────────────┴─────────────┘");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
