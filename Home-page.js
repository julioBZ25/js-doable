import STORE from "./store.js";

const HomePage = (function() {
  function renderTask(task){
    return `
    <li class= "task-card">
      <div>
        ${task.completed}
      </div>
      <div>
        <p>
          ${task.title}
        </p>  
        <div>
          ${task.due_date}
        </div>
      </div>
      <div>
        ${task.important}
      </div>
    </li>`
  }

  const generateTemplate = function() { 
    const listTasks = STORE.tasks
    return `
      <header class= "navbar">
        <div class= "logo">
          <img src="./assets/img/doable.png" alt="logo">
        </div>
        <div class="logout">
          <img src="./assets/img/Icon.png" alt="logout">
        </div>
      </header>
      <section class="sort-section">
        <p>Sort</p>
        <select name="sortBy" id="sortBy">
          <option value="alphabetical" data-id="alpha">Alphabetical (a-z)</option>
          <option value="due_date" data-id="date">Due date</option>
          <option value="importance" data-id="imp">Importance</option>
        </select>
      </section>
      <section class="tasks-section">
        <ul class="tasks-container" role="list">
          ${listTasks.map(task => renderTask(task)).join("")}
        </ul>
      </section>
    `
  }

  

  return {
    toString() {
      return generateTemplate()
    }
  }
})()

export default HomePage;