import DOMHandler from "./DOM.js";
import LoginPage from "./Login-page.js";
import { logout } from "./Login-service.js";
import STORE from "./store.js";

const CHECKBOX_VALUES = {
  pending: false,
  import: false
}

const SELECT_VALUES = {
  alpha: false,
  date: false,
  import: false
}

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
    const listTasks = STORE.filtered.length ? STORE.filtered : STORE.tasks
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
      <section class="sort-section">
        <p>Sort</p>
        <div class="js-sortBy">
          <select name="sortBy" id="sortBy">
            <option value="" disabled ${SELECT_VALUES.alpha || SELECT_VALUES.date || SELECT_VALUES.import ? '' : 'selected'}>Select your option</option>
            <option value="alpha" ${SELECT_VALUES.alpha ? 'selected' : ''}>Alphabetical (a-z)</option>
            <option value="date" ${SELECT_VALUES.date ? 'selected' : ''}>Due date</option>
            <option value="import" ${SELECT_VALUES.import ? 'selected' : ''}>Importance</option>
          </select>
        </div>
      </section>
      <section>
        <p>Show</p>
        <div class="js-showBy">        
          <input type="checkbox" id="pending" name="pending" value="pending" ${CHECKBOX_VALUES.pending ? 'checked' : ''}>
          <label for="pending">Only pending</label>
          <input type="checkbox" id="import" name="import" value="import" ${CHECKBOX_VALUES.import ? 'checked' : ''}>
          <label for="import">Only important</label>
        </div>
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
            SELECT_VALUES.alpha = true
            SELECT_VALUES.date = false
            SELECT_VALUES.import = false
            STORE.tasks.sort( (a,b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
            break;
          case "date":
            console.log("date")
            SELECT_VALUES.alpha = false
            SELECT_VALUES.date = true
            SELECT_VALUES.import = false
            STORE.tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
            break;
          case "import":
            console.log("import")
            SELECT_VALUES.alpha = false
            SELECT_VALUES.date = false
            SELECT_VALUES.import = true
            STORE.tasks.sort((a, b) => Number(b.important) - Number(a.important))
            break;
        }
        DOMHandler.reload()
      } catch (error) {
        DOMHandler.reload()
      }
    })
  }

  
  function listenShowBy() {
    const showBy =  document.querySelector('.js-showBy')
    showBy.addEventListener("change", (event) => {
      try {
        event.preventDefault()
        console.log(event.target.checked)
        // console.log(event.target.value)
        switch (event.target.value) {
          case "pending":
            console.log("pending")
            CHECKBOX_VALUES.pending = event.target.checked
            if(event.target.checked){
              STORE.filtered = STORE.tasks.filter(a => !a.completed)
              break;
            }else{
              STORE.filtered = []
              break;
            }
          case "import":
            console.log("import")
            CHECKBOX_VALUES.import = event.target.checked
            if(event.target.checked){
              STORE.filtered = STORE.tasks.filter(a => a.important)
              break;
            }else{
              STORE.filtered = []
              break;
            }
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
      listenSortBy()
      listenLogout()
      listenShowBy()
    }
  }
})()

export default HomePage;