import { PrismaClient } from '@prisma/client';

// Singleton de conexión Prisma para evitar fugas de sockets abiertos
// provocados por el Hot-Reloading de Next.js en entorno de desarrollo.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
