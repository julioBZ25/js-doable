import DOMHandler from "./DOM.js";
import LoginPage from "./Login-page.js";
import { logout } from "./Login-service.js";
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
          <a class="js-logout">
            <img src="./assets/img/Icon.png" alt="logout">
          </a>
        </div>
      </header>
      <p>Sort</p>
      <section class="sort-section js-sortBy">
        <select name="sortBy" id="sortBy">
          <option value="" disabled selected>Select your option</option>
          <option value="alpha">Alphabetical (a-z)</option>
          <option value="date">Due date</option>
          <option value="import">Importance</option>
        </select>
      </section>
      <section class="tasks-section">
        <ul class="tasks-container" role="list">
          ${listTasks.map(task => renderTask(task)).join("")}
        </ul>
      </section>
    `
  }

  function listenLogout() {
    const Logout = document.querySelector(".js-logout")

    Logout.addEventListener("click", async (event) => {
      event.preventDefault();

    try {
      await logout()
      DOMHandler.load(LoginPage);
    } catch (error){
      console.log(error.message);
    }
    })
  }

  function listenSortBy() {
    const sortBy =  document.getElementById('sortBy')
  
    sortBy.addEventListener("change", async (event) => {
      try {
        switch (event.target.value) {
          case "alpha":
            console.log("alpha")
            STORE.tasks.sort( (a,b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
            break;
          case "date":
            console.log("date")
            STORE.tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
            break;
          case "import":
            console.log("import")
            STORE.tasks.sort((a, b) => Number(b.important) - Number(a.important))
            break;
        }
        DOMHandler.reload()
      } catch (error) {
        DOMHandler.reload()
      }
    })
  }


  return {
    toString() {
      return generateTemplate()
    },
    addListeners() {
      return listenSortBy()
    }
  }
})()

export default HomePage;