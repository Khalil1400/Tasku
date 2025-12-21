import { request } from "./apiClient";

export function listTasks() {
  return request("/tasks");
}

export function getTask(id) {
  return request(`/tasks/${id}`);
}

export function createTask(payload) {
  return request("/tasks", {
    method: "POST",
    body: payload,
  });
}

export function updateTask(id, payload) {
  return request(`/tasks/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: "DELETE" });
}
