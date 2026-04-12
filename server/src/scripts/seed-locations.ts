import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding locations...");

  const locationsDir = path.join(__dirname, "../../../locations");

  // Read files
  const divisionsData = JSON.parse(
    fs.readFileSync(path.join(locationsDir, "bd-divisions.json"), "utf8")
  ).divisions;
  const districtsData = JSON.parse(
    fs.readFileSync(path.join(locationsDir, "bd-districts.json"), "utf8")
  ).districts;
  const upazilasData = JSON.parse(
    fs.readFileSync(path.join(locationsDir, "bd-upazilas.json"), "utf8")
  ).upazilas;
  const dhakaCityData = JSON.parse(
    fs.readFileSync(path.join(locationsDir, "dhaka-city.json"), "utf8")
  ).dhaka;

  console.log("Clearing existing areas...");
  await prisma.area.deleteMany({});

  const areasToInsert = [];

  // 1. Process Divisions
  const divisionsMap = new Map(); // id -> name
  for (const div of divisionsData) {
    divisionsMap.set(div.id, div.name);
    areasToInsert.push({
      name: div.name,
      latitude: parseFloat(div.lat),
      longitude: parseFloat(div.long),
      district: null, // divisions don't have a specific district
      division: div.name,
    });
  }

  // 2. Process Districts
  const districtsMap = new Map(); // id -> { name, divId, lat, long }
  for (const dist of districtsData) {
    const divName = divisionsMap.get(dist.division_id) || null;
    districtsMap.set(dist.id, {
      name: dist.name,
      divId: dist.division_id,
      lat: parseFloat(dist.lat),
      long: parseFloat(dist.long),
      divName,
    });

    areasToInsert.push({
      name: dist.name,
      latitude: parseFloat(dist.lat),
      longitude: parseFloat(dist.long),
      district: dist.name,
      division: divName,
    });
  }

  // 3. Process Upazilas
  for (const upz of upazilasData) {
    const parentDist = districtsMap.get(upz.district_id);
    if (parentDist) {
      areasToInsert.push({
        name: upz.name,
        latitude: parentDist.lat, // fallback to district lat
        longitude: parentDist.long, // fallback to district long
        district: parentDist.name,
        division: parentDist.divName,
      });
    }
  }

  // 4. Process Dhaka City Areas
  for (const dca of dhakaCityData) {
    const parentDist = districtsMap.get(dca.district_id);
    if (parentDist) {
      areasToInsert.push({
        name: dca.name,
        latitude: parentDist.lat, // fallback to district lat
        longitude: parentDist.long, // fallback to district long
        district: parentDist.name,
        division: parentDist.divName,
      });
    }
  }

  console.log(`Inserting ${areasToInsert.length} areas into the database...`);
  await prisma.area.createMany({
    data: areasToInsert,
  });

  console.log("Locations successfully seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
