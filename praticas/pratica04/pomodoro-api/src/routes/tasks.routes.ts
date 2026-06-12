import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const tasksRouter = Router();

// Converte BigInt para number em todos os campos da task
function serializeTask(task: Record<string, unknown>) {
  return {
    ...task,
    startDate: Number(task.startDate),
    completedDate: task.completedDate ? Number(task.completedDate) : null,
    interruptDate: task.interruptDate ? Number(task.interruptDate) : null,
  };
}

tasksRouter.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { startDate: 'desc' },
  });
  return res.json(tasks.map(serializeTask));
});

tasksRouter.post('/', async (req, res) => {
  const { id, name, duration, type, startDate } = req.body as {
    id: string;
    name: string;
    duration: number;
    type: string;
    startDate: number;
  };

  const task = await prisma.task.create({
    data: { id, name, duration, type, startDate },
  });

  return res.json(serializeTask(task as unknown as Record<string, unknown>));
});

tasksRouter.patch('/:id/complete', async (req, res) => {
  const { id } = req.params;
  const task = await prisma.task.update({
    where: { id },
    data: { completedDate: Date.now() },
  });
  return res.json(serializeTask(task as unknown as Record<string, unknown>));
});

tasksRouter.patch('/:id/interrupt', async (req, res) => {
  const { id } = req.params;
  const task = await prisma.task.update({
    where: { id },
    data: { interruptDate: Date.now() },
  });
  return res.json(serializeTask(task as unknown as Record<string, unknown>));
});

tasksRouter.delete('/', async (_req, res) => {
  await prisma.task.deleteMany();
  return res.json({ ok: true });
});