const prisma = require("../utils/prisma");

async function listTasks(userId) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function getTask(userId, id) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task || task.userId !== userId) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  return task;
}

async function createTask(userId, data) {
  return prisma.task.create({
    data: { ...data, userId },
  });
}

async function updateTask(userId, id, data) {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }

  return prisma.task.update({
    where: { id },
    data,
  });
}

async function deleteTask(userId, id) {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }

  await prisma.task.delete({ where: { id } });
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
