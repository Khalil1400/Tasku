const taskService = require("../services/taskService");

function parseId(id) {
  const parsed = Number(id);
  if (Number.isNaN(parsed)) {
    const err = new Error("Invalid task id");
    err.status = 400;
    throw err;
  }
  return parsed;
}

async function list(req, res, next) {
  try {
    const tasks = await taskService.listTasks(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const task = await taskService.getTask(req.user.id, id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const payload = req.validated?.body || req.body;
    const task = await taskService.createTask(req.user.id, payload);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const payload = req.validated?.body || req.body;
    const id = parseId(req.params.id);
    const task = await taskService.updateTask(req.user.id, id, payload);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);
    await taskService.deleteTask(req.user.id, id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
