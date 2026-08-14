const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_J3GrXuaC9ART@ep-hidden-cake-axapw8sh.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=30"
    }
  }
});

async function main() {
  try {
    console.log("Connecting to Neon...");
    const userCount = await prisma.user.count();
    console.log("SUCCESS! User count:", userCount);
  } catch (error) {
    console.error("FAILED TO CONNECT:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
