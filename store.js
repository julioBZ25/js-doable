import { getTasks } from "./task-service.js"

async function fetchTasks() {
  const tasks = await getTasks()
  STORE.tasks = tasks
}

const STORE = {
  tasks: [],
  filtered: [],
  fetchTasks
};

export default STORE;