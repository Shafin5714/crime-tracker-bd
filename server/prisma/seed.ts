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

const dhakaLocations = [
  { name: "Gulshan", latitude: 23.7925, longitude: 90.4078 },
  { name: "Dhanmondi", latitude: 23.7461, longitude: 90.3742 },
  { name: "Uttara", latitude: 23.8759, longitude: 90.3795 },
  { name: "Banani", latitude: 23.7937, longitude: 90.4066 },
  { name: "Mohammadpur", latitude: 23.7658, longitude: 90.358 },
  { name: "Mirpur", latitude: 23.8041, longitude: 90.3625 },
  { name: "Motijheel", latitude: 23.733, longitude: 90.417 },
  { name: "Basundhara", latitude: 23.8191, longitude: 90.4526 },
  { name: "Badda", latitude: 23.7805, longitude: 90.4267 },
  { name: "Khilgaon", latitude: 23.754, longitude: 90.422 },
  { name: "Lalbagh", latitude: 23.7189, longitude: 90.3881 },
  { name: "Tejgaon", latitude: 23.7597, longitude: 90.3927 },
  { name: "Shahbagh", latitude: 23.737, longitude: 90.3965 },
  { name: "Farmgate", latitude: 23.7561, longitude: 90.3872 },
  { name: "Agargaon", latitude: 23.7745, longitude: 90.3772 },
  { name: "Baridhara", latitude: 23.7999, longitude: 90.4208 },
  { name: "Nikunja", latitude: 23.8329, longitude: 90.4194 },
  { name: "Purbachal", latitude: 23.836, longitude: 90.521 },
  { name: "Rampura", latitude: 23.7612, longitude: 90.4207 },
  { name: "Shanti Nagar", latitude: 23.7381, longitude: 90.4116 },
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

  console.log("\n📍 Seeding Dhaka locations...");
  for (const location of dhakaLocations) {
    await prisma.area.upsert({
      where: { name: location.name },
      update: {},
      create: {
        ...location,
        district: "Dhaka",
        division: "Dhaka",
      },
    });
  }
  console.log(`✅ Seeded ${dhakaLocations.length} locations`);

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📋 Seeded Users:");
  console.log(
    "┌────────────────────────────────────┬──────────────────┬─────────────┐",
  );
  console.log(
    "│ Email                              │ Password         │ Role        │",
  );
  console.log(
    "├────────────────────────────────────┼──────────────────┼─────────────┤",
  );
  for (const user of seedUsers) {
    const email = user.email.padEnd(34);
    const password = user.password.padEnd(16);
    const role = user.role.padEnd(11);
    console.log(`│ ${email} │ ${password} │ ${role} │`);
  }
  console.log(
    "└────────────────────────────────────┴──────────────────┴─────────────┘",
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
