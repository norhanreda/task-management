import { apiFetch } from '../utils/fetchClient';

export async function fetchTasks(params) {
  return apiFetch(`tasks?${params}`);
}

export async function fetchTaskById(id) {
  return apiFetch(`tasks?id=eq.${id}`);
}

export async function addTask(body) {
  return apiFetch('tasks', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export async function updateTask(id, body) {
  return apiFetch(`tasks?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}

export async function deleteTask(id) {
  return apiFetch(`tasks?id=eq.${id}`, { method: 'DELETE' });
}
