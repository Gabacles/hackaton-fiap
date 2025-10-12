import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createActivity(teacherId: string, title: string, description: string | null) {
  return prisma.activity.create({ data: { teacherId, title, description } });
}

export async function listActivities() {
  return prisma.activity.findMany({ include: { questions: true } });
}

export async function addQuestion(activityId: string, text: string, options: any[]) {
  return prisma.question.create({ data: { activityId, text, options } });
}