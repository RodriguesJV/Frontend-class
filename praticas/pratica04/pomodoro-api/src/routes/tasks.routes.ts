import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const tasksRouter = Router();

// Listar todas as tarefas (ordenadas pela data de início mais recente)
tasksRouter.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { startDate: 'desc' },
  });
  return res.json(tasks);
});

// Criar uma nova tarefa
tasksRouter.post('/', async (req, res) => {
  const { id, name, duration, type, startDate } = req.body as {
    id: string;
    name: string;
    duration: number;
    type: string;
    startDate: number;
  };

  const task = await prisma.task.create({
    data: { id, name, duration, type, startDate: BigInt(startDate) },
  });

  return res.status(201).json(task);
});

// Marcar tarefa como concluída
tasksRouter.patch('/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { completedDate } = req.body as { completedDate: number };

  const task = await prisma.task.update({
    where: { id },
    data: { completedDate: BigInt(completedDate) },
  });

  return res.json(task);
});

// Marcar interrupção na tarefa
tasksRouter.patch('/:id/interrupt', async (req, res) => {
  const { id } = req.params;
  const { interruptDate } = req.body as { interruptDate: number };

  const task = await prisma.task.update({
    where: { id },
    data: { interruptDate: BigInt(interruptDate) },
  });

  return res.json(task);
});

// Apagar todas as tarefas (Limpar histórico)
tasksRouter.delete('/', async (_req, res) => {
  await prisma.task.deleteMany();
  return res.status(204).send();
});