// src/lib/prisma.ts
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const databaseUrl = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (import.meta.env.DEV) globalForPrisma.prisma = prisma;
