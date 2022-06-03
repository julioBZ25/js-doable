import apiFetch from "./api-fetch.js";

export function getTasks() {
  return apiFetch("tasks")
}
