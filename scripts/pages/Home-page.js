import DOMHandler from "../utils/DOM.js";
import { input } from "../utils/input.js";
import LoginPage from "./Login-page.js";
import STORE from "../store.js";
import { logout } from "../services/auth-services.js";
import {createTask, updateTask} from "../services/task-service.js"

const CHECKBOX_VALUES = {
  pending: false,
  import: false
}

const SORT_BY_HANDLER = {
  alpha: {
    comparator: (a,b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
  },
  date: {
    comparator: (a, b) => new Date(a.due_date) - new Date(b.due_date),
  },
  import: {
    comparator: (a, b) => Number(b.important) - Number(a.important),
  },
}

const IMPORTANT_COLORS = {
  important: '#EC4899',
  nonImportant: '#D1D5DB',
  completed: '#F9A8D4',
}

let SELECTED_VALUE = ''

const HomePage = (function() {
  function renderTask(task){
    return `
    <li class= "task-card">
      <div class="task-content">
        ${
          task.completed ? `<input type='checkbox' class='completedTask' data-id=${task.id} checked>` : `<input type='checkbox' data-id=${task.id} class='completedTask'>`
        }
        <div>
          ${task.title}
          ${task.due_date ? `<div>${task.due_date}</div>` : ''}
        </div>
      </div>
      <div class="js-important-button" data-id=${task.id} data-import=${task.important}>
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM9 12C9 12.5523 8.55229 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55229 11 9 11.4477 9 12ZM8 3C7.44772 3 7 3.44772 7 4V8C7 8.55228 7.44772 9 8 9C8.55229 9 9 8.55228 9 8V4C9 3.44772 8.55229 3 8 3Z" 
          fill=${task.important ? (task.completed ? IMPORTANT_COLORS.completed : IMPORTANT_COLORS.important) : IMPORTANT_COLORS.nonImportant} />
        </svg>
      </div>
    </li>`
  }

  const generateTemplate = function() { 
    const listTasks = STORE.filtered.length ? STORE.filtered : STORE.tasks
    const { createError } = createForm.state
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
        <p class="title-sort">Sort</p>
        <div class="js-sortBy">
          <select name="sortBy" id="sortBy">
            <option value="" disabled ${SELECTED_VALUE ? '' : 'selected'}>Select your option</option>
            <option value="alpha" ${SELECTED_VALUE === 'alpha' ? 'selected' : ''}>Alphabetical (a-z)</option>
            <option value="date" ${SELECTED_VALUE === 'date'  ? 'selected' : ''}>Due date</option>
            <option value="import" ${SELECTED_VALUE === 'import'  ? 'selected' : ''}>Importance</option>
          </select>
        </div>
      </section>
      <section class="show-section">
        <p class="title-show">Show</p>
        <div class="js-showBy">
          <div class="showPending">       
            <input type="checkbox" id="pending" name="pending" value="pending" ${CHECKBOX_VALUES.pending ? 'checked' : ''}>
            <label for="pending">Only pending</label>
          </div>
          <div class="showImportant">
            <input type="checkbox" id="import" name="import" value="import" ${CHECKBOX_VALUES.import ? 'checked' : ''}>
            <label for="import">Only important</label>
          </div>
        </div>
      </section>
      <section class="tasks-section">
        <ul class="tasks-container" role="list">
          ${listTasks.map(task => renderTask(task)).join("")}
        </ul>
      </section>
      <section class="newTasks-container">
        <form class="js-new-task-form">
          ${input({
            label: "title",
            id: "title",
            type: "title",
            placeholder: "What things you don't need to forget?",
          })}
          ${input({
            label: "Due date",
            id: "due_date",
            type: "due_date",
            placeholder: "mm / dd / yy",
          })}
          ${createError ? 
            `<p>${createError}</p>`: ''
          }
          <button class="js-new-task-submit">Create Task</button>
        </form>
      </section>
      </section>
    `
  }

  function listenCompletedTask(){
    const completedCheckbox = document.querySelectorAll('.completedTask')
    
    completedCheckbox.forEach(element => {
      element.addEventListener('change', async (event) => {
        event.preventDefault()
  
        const {checked, dataset: {id}} = event.target
  
        await updateTask(id, { completed: checked })
        const task = STORE.tasks.find(a => a.id.toString() === id)
        task.completed = checked
        DOMHandler.reload()
      })
    })
  }

  function listenImportantTask(){
    const importantTask = document.querySelectorAll(".js-important-button")

    importantTask.forEach(element => {
      element.addEventListener("click", async function(){

        // console.log(event)
        const {dataset: {id, important}} = this

        await updateTask(id, { important: !(important === 'true')})
        const task = STORE.tasks.find(a => a.id.toString() === id)
        task.important = !(important === 'true')
        DOMHandler.reload()
      })
    })
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
  
    sortBy.addEventListener("change", (event) => {
      try {
        const handler = SORT_BY_HANDLER[event.target.value]
        SELECTED_VALUE = event.target.value
        STORE.tasks.sort(handler.comparator)
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

  function listenSubmitTask(){
    const form = document.querySelector(".js-new-task-form")

    form.addEventListener("submit", async (event) => {
      try{
        event.preventDefault();
        createForm.state.createError = null

        const { title: {value: titleValue}, due_date: {value: due_dateValue} } = event.target

        if (!titleValue){
          throw new Error("Title must be complete")
        }
        await createTask({
          title: titleValue,
          due_date: due_dateValue
        })
        DOMHandler.reload()
      }catch(error){
        createForm.state.createError = error.message
        DOMHandler.reload()
      }
    })
  }

  const createForm = {
    state:{
      createError: null,
    }
  }

  return {
    toString() {
      return generateTemplate()
    },
    addListeners() {
      listenSortBy()
      listenLogout()
      listenShowBy()
      listenSubmitTask()
      listenCompletedTask()
      listenImportantTask()
    }
  }
})()

export default HomePage;