import apiFetch from "./api-fetch.js";
import STORE from "./store.js";

export function getTasks() {
  return apiFetch("tasks")
}

export async function createTask(dataTasks) {
  const newTask = await apiFetch("tasks", {body: dataTasks})
  STORE.tasks.push(newTask)
}

export async function updateTask(id, dataTask){
  await apiFetch(`tasks/${id}`, {method: 'PATCH', body: dataTask})
}