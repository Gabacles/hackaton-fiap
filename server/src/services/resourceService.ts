import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createResource(teacherId: string, title: string, url: string) {
  return prisma.resource.create({ data: { teacherId, title, url } });
}

export async function listResources() {
  return prisma.resource.findMany();
}