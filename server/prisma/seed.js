const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@tasku.com" },
    update: {},
    create: {
      email: "demo@tasku.com",
      passwordHash,
    },
  });

  const existingTasks = await prisma.task.count({ where: { userId: user.id } });
  if (existingTasks === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: "Finish Tasku backend",
          description: "Wire up Prisma and auth",
          category: "Work",
          userId: user.id,
          favorite: true,
        },
        {
          title: "Plan weekly review",
          description: "Set reminders for next sprint",
          category: "Planning",
          userId: user.id,
          reminderAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
