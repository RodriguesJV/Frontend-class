import { PrismaClient } from '@prisma/client';

// No Prisma 7, passamos a url ou o adapter aqui se o config automático falhar
export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});