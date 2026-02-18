import "dotenv/config"; //tanpa import ini, env variabel tidak akan terbaca
import { PrismaClient } from "@prisma/client"; //class utama dari query database
import { PrismaPg } from "@prisma/adapter-pg"; //Singkatnya: Prisma ↔ Adapter PG ↔ PostgreSQL
import pkg from "pg";

const { Pool } = pkg;

const globalForPrisma = global;

const pool =
  globalForPrisma.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pgPool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
