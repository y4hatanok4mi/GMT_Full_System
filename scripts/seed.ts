const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    // Seed Categories
    const categories = ["Visual", "Auditory", "Read & Write"];

    // Use `createMany` to insert multiple categories at once
    await database.category.createMany({
      data: categories.map((name) => ({ name })),
    });

    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Seeding failed!", error);
  } finally {
    await database.$disconnect();
  }
}

main();
